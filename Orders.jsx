import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";

import { toast } from "react-toastify";

import api from "../api";
import PageTitle from "../components/PageTitle";

export default function Orders({ type }) {
  const sales = type === "sales";

  const [rows, setRows] = useState([]);
  const [parties, setParties] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    party: "",
    product: "",
    quantity: 1,
    price: "",
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadOrders();
    loadData();
  }, [sales]);

  async function loadOrders() {
    try {
      const response = await api.get(
        sales ? "/sales-orders" : "/purchase-orders"
      );

      setRows(response.data || []);
    } catch (error) {
      console.error("Orders load error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load orders."
      );
    }
  }

  async function loadData() {
    try {
      const partyResponse = await api.get(
        "/parties?type=" +
          (sales ? "Customer" : "Supplier")
      );

      const productResponse = await api.get(
        "/products?limit=100"
      );

      setParties(partyResponse.data || []);
      setProducts(productResponse.data?.items || []);
    } catch (error) {
      console.error("Data load error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load data."
      );
    }
  }

  function handleProductChange(event) {
    const productId = event.target.value;

    const selectedProduct = products.find(
      (product) => product._id === productId
    );

    setForm({
      ...form,
      product: productId,
      price: selectedProduct
        ? selectedProduct.price
        : "",
    });
  }

  async function createOrder() {
    if (!form.party) {
      toast.warning(
        sales
          ? "Please select a customer."
          : "Please select a supplier."
      );
      return;
    }

    if (!form.product) {
      toast.warning("Please select a product.");
      return;
    }

    if (Number(form.quantity) <= 0) {
      toast.warning("Please enter a valid quantity.");
      return;
    }

    if (Number(form.price) <= 0) {
      toast.warning("Please enter a valid price.");
      return;
    }

    try {
      const orderData = {
        [sales ? "customer" : "supplier"]: form.party,

        products: [
          {
            product: form.product,
            quantity: Number(form.quantity),
            price: Number(form.price),
          },
        ],
      };

      await api.post(
        sales
          ? "/sales-orders"
          : "/purchase-orders",
        orderData
      );

      toast.success(
        sales
          ? "Sales order created successfully."
          : "Purchase order created successfully."
      );

      setForm({
        party: "",
        product: "",
        quantity: 1,
        price: "",
      });

      setShowForm(false);

      await loadOrders();
    } catch (error) {
      console.error("Create order error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create order."
      );
    }
  }

  async function updateStatus(order, newStatus) {
    try {
      const partyId = sales
        ? order.customer?._id || order.customer
        : order.supplier?._id || order.supplier;

      const productData = (order.products || []).map(
        (item) => ({
          product:
            item.product?._id ||
            item.product,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })
      );

      const body = {
        [sales ? "customer" : "supplier"]:
          partyId,
        products: productData,
        status: newStatus,
      };

      const url = sales
        ? "/sales-orders/" + order._id
        : "/purchase-orders/" + order._id;

      await api.put(url, body);

      toast.success("Order status updated successfully.");

      await loadOrders();
    } catch (error) {
      console.error("Status update error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update status."
      );
    }
  }

  return (
    <>
      <PageTitle
        title={
          sales
            ? "Sales Orders"
            : "Purchase Orders"
        }
        action={
          <Button
            variant="contained"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "Close"
              : "Create Order"}
          </Button>
        }
      />

      {showForm && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
          >
            <TextField
              select
              label={
                sales
                  ? "Customer"
                  : "Supplier"
              }
              value={form.party}
              onChange={(event) =>
                setForm({
                  ...form,
                  party: event.target.value,
                })
              }
              sx={{ minWidth: 220 }}
            >
              {parties.map((party) => (
                <MenuItem
                  key={party._id}
                  value={party._id}
                >
                  {party.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Product"
              value={form.product}
              onChange={handleProductChange}
              sx={{ minWidth: 220 }}
            >
              {products.map((product) => (
                <MenuItem
                  key={product._id}
                  value={product._id}
                >
                  {product.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Qty"
              type="number"
              value={form.quantity}
              onChange={(event) =>
                setForm({
                  ...form,
                  quantity:
                    event.target.value,
                })
              }
            />

            <TextField
              label="Price"
              type="number"
              value={form.price}
              onChange={(event) =>
                setForm({
                  ...form,
                  price:
                    event.target.value,
                })
              }
            />

            <Button
              variant="contained"
              onClick={createOrder}
              sx={{ minWidth: 130 }}
            >
              Save Order
            </Button>
          </Stack>
        </Paper>
      )}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>

              <TableCell>
                {sales
                  ? "Customer"
                  : "Supplier"}
              </TableCell>

              <TableCell>Total</TableCell>

              <TableCell>Status</TableCell>

              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  {order._id
                    ? order._id.slice(-8)
                    : "-"}
                </TableCell>

                <TableCell>
                  {(sales
                    ? order.customer
                    : order.supplier
                  )?.name || "-"}
                </TableCell>

                <TableCell>
                  ₹{order.totalPrice || 0}
                </TableCell>

                <TableCell>
                  <select
                    value={
                      order.status ||
                      "Pending"
                    }
                    onChange={(event) =>
                      updateStatus(
                        order,
                        event.target.value
                      )
                    }
                    style={{
                      width: "150px",
                      height: "40px",
                      padding: "6px 10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px",
                      background: "white",
                      cursor: "pointer",
                    }}
                  >
                    {sales ? (
                      <>
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </>
                    ) : (
                      <>
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Ordered">
                          Ordered
                        </option>

                        <option value="Received">
                          Received
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </>
                    )}
                  </select>
                </TableCell>

                <TableCell>
                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </TableCell>
              </TableRow>
            ))}

            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

