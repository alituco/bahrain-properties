import React from "react";
import {
  Box,
} from "@mui/material";


import Navbar from "../../components/general/Navbar/index";
export default function Dashboard() {
    return (
    <>
        <Navbar/>
        <Box>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>
        </Box>
    </>
    );
  }
  