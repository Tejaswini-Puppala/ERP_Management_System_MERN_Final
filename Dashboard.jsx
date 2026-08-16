import React from "react";
import { Grid, Card, CardContent, Typography, Stack, LinearProgress } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import api from "../api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats,setStats]=useState({products:0,customers:0,sales:0,invoices:0});
  useEffect(()=>{Promise.all([
    api.get("/products?limit=1"),api.get("/parties?type=Customer"),api.get("/sales-orders"),api.get("/invoices")
  ]).then(([p,c,s,i])=>setStats({products:p.data.total,customers:c.data.length,sales:s.data.length,invoices:i.data.length})).catch(()=>{});},[]);
  const cards=[["Products",stats.products,InventoryIcon],["Customers",stats.customers,PeopleIcon],["Sales Orders",stats.sales,ShoppingCartIcon],["Invoices",stats.invoices,ReceiptIcon]];
  return <>
    <Typography variant="h4" fontWeight={800} mb={3}>Dashboard</Typography>
    <Grid container spacing={3}>
      {cards.map(([name,val,Icon])=><Grid item xs={12} sm={6} md={3} key={name}><Card><CardContent><Stack direction="row" spacing={2} alignItems="center"><Icon color="primary"/><div><Typography color="text.secondary">{name}</Typography><Typography variant="h4" fontWeight={800}>{val}</Typography></div></Stack></CardContent></Card></Grid>)}
    </Grid>
    <Card sx={{mt:3}}><CardContent><Typography variant="h6" fontWeight={700}>ERP Operations</Typography><Typography color="text.secondary" sx={{mt:1}}>Manage products, customers, suppliers, sales, purchases, GRN and invoices from the sidebar.</Typography><LinearProgress sx={{mt:3}}/></CardContent></Card>
  </>;
}
