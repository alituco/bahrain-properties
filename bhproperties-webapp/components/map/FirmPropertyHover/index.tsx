"use client";

import React from "react";
import { Box, Paper, Typography } from "@mui/material";

interface FirmPropertyHoverProps {
  x: number;
  y: number;
  savedByFirm?: boolean;
  status?: string;
  parcelNo?: string;
}

export default function FirmPropertyHover({
  x,
  y,
  savedByFirm,
  status,
  parcelNo,
}: FirmPropertyHoverProps) {
  if (!parcelNo) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        pointerEvents: "none",
        left: x,
        top: y,
        transform: "translate(10px, 10px)",
        zIndex: 999,
      }}
    >
      <Paper sx={{ p: 1 }}>
        {status && <Typography variant="subtitle1"> Status: {status}</Typography>}
        
      </Paper>
    </Box>
  );
}
