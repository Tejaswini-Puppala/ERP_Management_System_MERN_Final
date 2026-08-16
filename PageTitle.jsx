import React from "react";
import { Stack, Typography } from "@mui/material";
export default function PageTitle({ title, action }) {
  return <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
    <Typography variant="h5" fontWeight={700}>{title}</Typography>{action}
  </Stack>;
}
