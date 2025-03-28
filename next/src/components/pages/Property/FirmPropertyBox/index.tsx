"use client";

import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Example statuses
const STATUSES = ["listed", "potential buyer", "closing deal", "paperwork", "sold"];

interface FirmProperty {
  id: number;
  firm_id: number;
  parcel_no: string;
  status: string;
  asking_price?: number;
  sold_price?: number;
  created_at?: string;
  updated_at?: string;
}

interface FirmPropertyBoxProps {
  parcelNo: string;
}

const FirmPropertyBox: React.FC<FirmPropertyBoxProps> = ({ parcelNo }) => {
  const router = useRouter();

  const [firmProperty, setFirmProperty] = useState<FirmProperty | null>(null);
  const [status, setStatus] = useState<string>("listed");
  const [askingPrice, setAskingPrice] = useState<string>("");
  const [soldPrice, setSoldPrice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState(false);

  // 1) Fetch the property for this parcelNo
  useEffect(() => {
    const fetchFirmProperty = async () => {
      try {
        // The dedicated route: GET /firm-properties/:parcelNo
        const res = await fetch(`${API_URL}/firm-properties/${parcelNo}`, {
          credentials: "include",
        });
        if (res.status === 404) {
          // Means there's no record for this parcelNo => user can create a new one
          console.log("No firm property found for parcelNo:", parcelNo);
          return;
        }

        const data = await res.json();
        if (res.ok && data.firmProperty) {
          const record = data.firmProperty as FirmProperty;
          setFirmProperty(record);
          // Initialize local states from the record
          setStatus(record.status);
          setAskingPrice(record.asking_price ? record.asking_price.toString() : "");
          setSoldPrice(record.sold_price ? record.sold_price.toString() : "");
        }
      } catch (error) {
        console.error("Error fetching firm property:", error);
      }
    };

    if (parcelNo) {
      fetchFirmProperty();
    }
  }, [parcelNo]);

  // 2) Save / Update
  const handleSaveClick = async () => {
    setLoading(true);

    // Convert askingPrice / soldPrice strings to float or null
    const bodyData = {
      parcel_no: parcelNo,
      status,
      asking_price: askingPrice ? parseFloat(askingPrice) : null,
      sold_price: soldPrice ? parseFloat(soldPrice) : null,
    };

    try {
      if (!firmProperty) {
        // Create new property => POST /firm-properties
        const res = await fetch(`${API_URL}/firm-properties`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });
        const data = await res.json();
        if (res.ok) {
          console.log("Created new firm property:", data.firmProperty);
          setFirmProperty(data.firmProperty);
        } else {
          console.error("Error creating firm property:", data.message);
        }
      } else {
        // Update existing property => PATCH /firm-properties/:id
        const res = await fetch(`${API_URL}/firm-properties/${firmProperty.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });
        const data = await res.json();
        if (res.ok) {
          console.log("Updated firm property:", data.updatedProperty);
          setFirmProperty(data.updatedProperty);
        } else {
          console.error("Error updating firm property:", data.message);
        }
      }
    } catch (error) {
      console.error("Error saving firm property:", error);
    } finally {
      setLoading(false);
      setShowDialog(false);
      // Optionally refresh the page if needed
      router.refresh();
    }
  };

  // Confirm dialog
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Manage Firm Property
      </Typography>

      {!firmProperty && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          This property is <strong>not</strong> in your firm’s list. Provide details to create it.
        </Typography>
      )}

      {firmProperty && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          This property is <strong>saved</strong> by your firm.<br />
          Status: <strong>{firmProperty.status}</strong><br />
          Asking Price: <strong>{firmProperty.asking_price ?? "N/A"}</strong><br />
          Sold Price: <strong>{firmProperty.sold_price ?? "N/A"}</strong>
        </Typography>
      )}

      {/* Status */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as string)}
        >
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Asking Price */}
      <TextField
        label="Asking Price"
        type="number"
        fullWidth
        sx={{ mb: 2 }}
        value={askingPrice}
        onChange={(e) => setAskingPrice(e.target.value)}
      />

      {/* Sold Price */}
      <TextField
        label="Sold Price"
        type="number"
        fullWidth
        sx={{ mb: 2 }}
        value={soldPrice}
        onChange={(e) => setSoldPrice(e.target.value)}
      />

      <Button variant="contained" disabled={loading} onClick={openDialog}>
        {firmProperty ? "Update Property" : "Save Property"}
      </Button>

      {loading && (
        <Box sx={{ display: "inline-block", ml: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onClose={closeDialog}>
        <DialogTitle>Confirm {firmProperty ? "Update" : "Creation"}</DialogTitle>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography>
            Are you sure you want to {firmProperty ? "update" : "create"} this property with:
          </Typography>
          <Typography>Status: {status}</Typography>
          <Typography>Asking Price: {askingPrice || "N/A"}</Typography>
          <Typography>Sold Price: {soldPrice || "N/A"}</Typography>
        </Box>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSaveClick} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FirmPropertyBox;
