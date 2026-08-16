import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem } from "@mui/material";

export default function ModalForm({ open, onClose, title, fields, value, setValue, onSubmit }) {
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Stack spacing={2} sx={{ mt: 1 }}>
        {fields.map(f => f.type === "select" ? (
          <TextField key={f.name} select label={f.label} value={value[f.name] ?? ""} onChange={e => setValue(v => ({...v, [f.name]: e.target.value}))}>
            {f.options.map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
          </TextField>
        ) : (
          <TextField key={f.name} label={f.label} type={f.type || "text"} value={value[f.name] ?? ""} onChange={e => setValue(v => ({...v, [f.name]: e.target.value}))} />
        ))}
      </Stack>
    </DialogContent>
    <DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" onClick={onSubmit}>Save</Button></DialogActions>
  </Dialog>;
}
