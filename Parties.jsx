import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import api from "../api";
import PageTitle from "../components/PageTitle";
import ModalForm from "../components/ModalForm";

export default function Parties({ type }) {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [search, setSearch] = useState("");

  const load = () =>
    api
      .get(`/parties?type=${type}&search=${encodeURIComponent(search)}`)
      .then((r) => setRows(r.data));

  useEffect(() => {
    load();
  }, [type, search]);

  const empty = {
    type,
    name: "",
    contact: "",
    address: "",
  };

  const save = async () => {
    if (edit?._id) {
      await api.put(`/parties/${edit._id}`, edit);
    } else {
      await api.post("/parties", edit);
    }

    setOpen(false);
    setEdit(null);
    load();
  };

  const del = async (id) => {
    if (window.confirm("Delete?")) {
      await api.delete(`/parties/${id}`);
      load();
    }
  };

  return (
    <>
      <PageTitle
        title={`${type} Directory`}
        action={
          <Button
            variant="contained"
            onClick={() => {
              setEdit({ ...empty, type });
              setOpen(true);
            }}
          >
            Add {type}
          </Button>
        }
      />

      <Stack spacing={2}>
        <TextField
          size="small"
          label={`Search ${type}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.contact}</TableCell>
                  <TableCell>{r.address}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setEdit(r);
                        setOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton onClick={() => del(r._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Stack>

      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        title={`${edit?._id ? "Edit" : "Add"} ${type}`}
        value={edit || empty}
        setValue={setEdit}
        onSubmit={save}
        fields={[
          { name: "name", label: "Name" },
          { name: "contact", label: "Contact" },
          { name: "address", label: "Address" },
        ]}
      />
    </>
  );
}