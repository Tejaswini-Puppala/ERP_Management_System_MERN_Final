import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store";

export default function Login() {
  const [form, setForm] = useState({
    email: "admin@erp.com",
    password: "Admin@123",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      console.log("LOGIN SUCCESS:", response.data);

      dispatch(loginSuccess(response.data));

      navigate("/dashboard");
    } catch (e) {
      console.log("LOGIN ERROR:", e.response?.data || e.message);

      setError(
        e.response?.data?.message ||
        "Login failed. Please check email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="auth-bg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ width: 420, maxWidth: "95%" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            mb={1}
          >
            ERP Login
          </Typography>

          <Typography
            color="text.secondary"
            mb={3}
          >
            Sign in to manage your business
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={submit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              margin="normal"
              value={form.email}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Button
              fullWidth
              size="large"
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <Typography mt={3}>
            New user?{" "}
            <MuiLink
              component={Link}
              to="/register"
            >
              Register
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}