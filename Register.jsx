import React, { useState } from "react";
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Link as MuiLink, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"Sales" });
  const [error, setError] = useState("");
  const dispatch = useDispatch(); const navigate = useNavigate();
  const submit = async e => { e.preventDefault(); try { const {data}=await api.post("/auth/register",form); dispatch(loginSuccess(data)); navigate("/dashboard"); } catch(e){setError(e.response?.data?.message||"Registration failed");} };
  return <Box className="auth-bg"><Card sx={{width:450,maxWidth:"95%"}}><CardContent sx={{p:4}}>
    <Typography variant="h4" fontWeight={800} mb={2}>Create Account</Typography>
    {error && <Alert severity="error">{error}</Alert>}
    <form onSubmit={submit}>
      <TextField fullWidth label="Name" margin="normal" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <TextField fullWidth label="Email" margin="normal" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <TextField fullWidth label="Password" type="password" margin="normal" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
      <TextField fullWidth select label="Role" margin="normal" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
        {["Sales","Purchase","Inventory"].map(r=><MenuItem key={r} value={r}>{r}</MenuItem>)}
      </TextField>
      <Button fullWidth variant="contained" type="submit" sx={{mt:2}}>Register</Button>
    </form>
    <Typography mt={3}>Already registered? <MuiLink component={Link} to="/login">Login</MuiLink></Typography>
  </CardContent></Card></Box>;
}
