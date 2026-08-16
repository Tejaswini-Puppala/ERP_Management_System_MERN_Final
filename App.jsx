import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Divider,
  useMediaQuery,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Parties from "./pages/Parties";
import Orders from "./pages/Orders";
import GRN from "./pages/GRN";
import Invoices from "./pages/Invoices";
import Admin from "./pages/Admin";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const permissions = {
  Admin: [
    "/dashboard",
    "/products",
    "/customers",
    "/suppliers",
    "/sales-orders",
    "/purchase-orders",
    "/grn",
    "/invoices",
    "/admin",
  ],

  Sales: [
    "/dashboard",
    "/products",
    "/customers",
    "/sales-orders",
    "/invoices",
  ],

  Purchase: [
    "/dashboard",
    "/products",
    "/suppliers",
    "/purchase-orders",
    "/grn",
  ],

  Inventory: [
    "/dashboard",
    "/products",
    "/grn",
  ],
};

const items = [
  ["Dashboard", "/dashboard", DashboardIcon],
  ["Products", "/products", InventoryIcon],
  ["Customers", "/customers", PeopleIcon],
  ["Suppliers", "/suppliers", PeopleIcon],
  ["Sales Orders", "/sales-orders", ShoppingCartIcon],
  ["Purchase Orders", "/purchase-orders", LocalShippingIcon],
  ["GRN", "/grn", ReceiptLongIcon],
  ["Invoices", "/invoices", ReceiptLongIcon],
];

function Protected() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function RoleRoute({ path }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowedPages = permissions[user.role] || [];

  if (!allowedPages.includes(path)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function Layout() {
  const [open, setOpen] = React.useState(false);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const mobile = useMediaQuery("(max-width:900px)");
  const width = 250;

  const allowedPages = permissions[user?.role] || [];

  const visibleItems = items.filter(([label, path]) =>
    allowedPages.includes(path)
  );

  const drawer = (
    <Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          ERP Management
        </Typography>

        <Typography variant="caption">
          {user?.role} • {user?.name}
        </Typography>
      </Box>

      <Divider />

      <List>
        {visibleItems.map(([label, path, Icon]) => (
          <ListItemButton
            key={path}
            component={Link}
            to={path}
            selected={location.pathname === path}
            onClick={() => setOpen(false)}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>

            <ListItemText primary={label} />
          </ListItemButton>
        ))}

        {/* USER MANAGEMENT */}

        {user?.role === "Admin" && (
          <ListItemButton
            component={Link}
            to="/admin"
            selected={location.pathname === "/admin"}
            onClick={() => setOpen(false)}
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>

            <ListItemText primary="User Management" />
          </ListItemButton>
        )}
      </List>

      <Divider />

      <ListItemButton
        onClick={() => {
          dispatch(logout());
          navigate("/login");
        }}
      >
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>

        <ListItemText primary="Logout" />
      </ListItemButton>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {mobile && (
            <IconButton
              color="inherit"
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
          >
            ERP Management System
          </Typography>

          <Typography variant="body2">
            {user?.email}
          </Typography>
        </Toolbar>
      </AppBar>

      {mobile ? (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width,
            "& .MuiDrawer-paper": {
              width,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 10,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <>
      <Routes>

        {/* PUBLIC */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED */}

        <Route element={<Protected />}>
          <Route element={<Layout />}>

            <Route
              path="/dashboard"
              element={
                <RoleRoute path="/dashboard" />
              }
            >
              <Route
                index
                element={<Dashboard />}
              />
            </Route>

            <Route
              path="/products"
              element={
                <RoleRoute path="/products" />
              }
            >
              <Route
                index
                element={<Products />}
              />
            </Route>

            <Route
              path="/customers"
              element={
                <RoleRoute path="/customers" />
              }
            >
              <Route
                index
                element={<Parties type="Customer" />}
              />
            </Route>

            <Route
              path="/suppliers"
              element={
                <RoleRoute path="/suppliers" />
              }
            >
              <Route
                index
                element={<Parties type="Supplier" />}
              />
            </Route>

            <Route
              path="/sales-orders"
              element={
                <RoleRoute path="/sales-orders" />
              }
            >
              <Route
                index
                element={<Orders type="sales" />}
              />
            </Route>

            <Route
              path="/purchase-orders"
              element={
                <RoleRoute path="/purchase-orders" />
              }
            >
              <Route
                index
                element={<Orders type="purchase" />}
              />
            </Route>

            <Route
              path="/grn"
              element={
                <RoleRoute path="/grn" />
              }
            >
              <Route
                index
                element={<GRN />}
              />
            </Route>

            <Route
              path="/invoices"
              element={
                <RoleRoute path="/invoices" />
              }
            >
              <Route
                index
                element={<Invoices />}
              />
            </Route>

            {/* USER MANAGEMENT */}

            <Route
              path="/admin"
              element={<Admin />}
            />

          </Route>
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}