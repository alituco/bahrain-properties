"use client";

import React from "react";
import { Box, Paper, Typography } from "@mui/material";

interface ValuationHoverProps {
  x: number;
  y: number;
  parcelNo: string;
  valuationType?: string;
  valuationAmount?: number;
  valuationDate?: string;
}

export default function ValuationHover({
  x,
  y,
  parcelNo,
  valuationType,
  valuationAmount,
  valuationDate,
}: ValuationHoverProps) {
  return (
    <Box
      sx={{
        position: "absolute",
        pointerEvents: "none", // ignore mouse events
        left: x,
        top: y,
        transform: "translate(10px, 10px)",
        zIndex: 999,
      }}
    >
      <Paper sx={{ p: 1 }}>
        <Typography variant="subtitle1">Parcel: {parcelNo}</Typography>
        <Typography variant="body2">Type: {valuationType}</Typography>
        <Typography variant="body2">Amount: {valuationAmount}</Typography>
        <Typography variant="body2">Date: {valuationDate}</Typography>
      </Paper>
    </Box>
  );
}
