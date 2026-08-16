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
  TablePagination,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import api from "../api";
import PageTitle from "../components/PageTitle";
import ModalForm from "../components/ModalForm";

export default function Products() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);

  const empty = {
    title: "",
    sku: "",
    price: "",
    stock: "",
    reorderLevel: "10",
  };

  const load = () => {
    api
      .get(
        `/products?page=${page + 1}&limit=10&search=${encodeURIComponent(
          search
        )}`
      )
      .then((r) => setData(r.data))
      .catch((err) => {
        console.error("Products load error:", err);
      });
  };

  useEffect(() => {
    load();
  }, [page, search]);

  const save = async () => {
    try {
      if (edit?._id) {
        await api.put(`/products/${edit._id}`, edit);
      } else {
        await api.post("/products", edit);
      }

      setOpen(false);
      setEdit(null);
      load();
    } catch (err) {
      console.error("Product save error:", err);
    }
  };

  const del = async (id) => {
    if (window.confirm("Delete product?")) {
      try {
        await api.delete(`/products/${id}`);
        load();
      } catch (err) {
        console.error("Product delete error:", err);
      }
    }
  };

  return (
    <>
      <PageTitle
        title="Product Management"
        action={
          <Button
            variant="contained"
            onClick={() => {
              setEdit({ ...empty });
              setOpen(true);
            }}
          >
            Add Product
          </Button>
        }
      />

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Search title / SKU"
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
        />
      </Stack>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Reorder Level</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.items.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.title}</TableCell>
                <TableCell>{p.sku}</TableCell>
                <TableCell>₹{p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>{p.reorderLevel}</TableCell>

                <TableCell>
                  <IconButton
                    onClick={() => {
                      setEdit(p);
                      setOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => del(p._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {data.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={data.total}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
        />
      </Paper>

      <ModalForm
        open={open}
        onClose={() => setOpen(false)}
        title={edit?._id ? "Edit Product" : "Add Product"}
        value={edit || empty}
        setValue={setEdit}
        onSubmit={save}
        fields={[
          { name: "title", label: "Title" },
          { name: "sku", label: "SKU" },
          { name: "price", label: "Price", type: "number" },
          { name: "stock", label: "Stock", type: "number" },
          {
            name: "reorderLevel",
            label: "Reorder Level",
            type: "number",
          },
        ]}
      />
    </>
  );
}