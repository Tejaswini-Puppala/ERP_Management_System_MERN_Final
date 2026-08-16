import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";

import { jsPDF } from "jspdf";

import api from "../api";
import PageTitle from "../components/PageTitle";

export default function Invoices() {
  const [rows, setRows] = useState([]);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState("");

  async function load() {
    try {
      const invoiceResponse =
        await api.get("/invoices");

      const orderResponse =
        await api.get("/sales-orders");

      setRows(invoiceResponse.data || []);
      setOrders(orderResponse.data || []);
    } catch (error) {
      console.error(
        "Invoice load error:",
        error
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!order) {
      alert("Please select a Sales Order.");
      return;
    }

    try {
      await api.post("/invoices", {
        salesOrder: order,
      });

      alert(
        "Invoice created successfully."
      );

      setOrder("");
      await load();
    } catch (error) {
      console.error(
        "Invoice create error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to create invoice."
      );
    }
  }

  function pdf(invoice) {
    const doc = new jsPDF();

    doc.text(
      "ERP INVOICE",
      20,
      20
    );

    doc.text(
      `Invoice: ${
        invoice.invoiceNumber || ""
      }`,
      20,
      35
    );

    doc.text(
      `Customer: ${
        invoice.salesOrder
          ?.customer?.name || ""
      }`,
      20,
      50
    );

    doc.text(
      `Amount: Rs. ${
        invoice.amount || 0
      }`,
      20,
      65
    );

    doc.text(
      `Status: ${
        invoice.status || "Pending"
      }`,
      20,
      80
    );

    doc.save(
      `${
        invoice.invoiceNumber ||
        "invoice"
      }.pdf`
    );
  }

  return (
    <>
      <PageTitle
        title="Invoices"
        action={
          <Stack
            direction="row"
            spacing={1}
          >
            <TextField
              select
              size="small"
              label="Sales Order"
              value={order}
              onChange={(event) =>
                setOrder(
                  event.target.value
                )
              }
              sx={{
                minWidth: 220,
              }}
            >
              {orders.map(
                (salesOrder) => (
                  <MenuItem
                    key={
                      salesOrder._id
                    }
                    value={
                      salesOrder._id
                    }
                  >
                    {salesOrder._id.slice(
                      -8
                    )}{" "}
                    -{" "}
                    {salesOrder
                      .customer
                      ?.name || ""}
                  </MenuItem>
                )
              )}
            </TextField>

            <Button
              variant="contained"
              onClick={create}
            >
              Generate
            </Button>
          </Stack>
        }
      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Invoice
              </TableCell>

              <TableCell>
                Customer
              </TableCell>

              <TableCell>
                Amount
              </TableCell>

              <TableCell>
                Status
              </TableCell>

              <TableCell>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map(
              (invoice) => (
                <TableRow
                  key={
                    invoice._id
                  }
                >
                  <TableCell>
                    {
                      invoice.invoiceNumber
                    }
                  </TableCell>

                  <TableCell>
                    {invoice
                      .salesOrder
                      ?.customer
                      ?.name ||
                      "-"}
                  </TableCell>

                  <TableCell>
                    ₹
                    {invoice.amount ||
                      0}
                  </TableCell>

                  <TableCell>
                    {invoice.status ||
                      "Pending"}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        pdf(invoice)
                      }
                    >
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}

            {rows.length ===
              0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
