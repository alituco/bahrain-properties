"use client";

import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';

const StyledDrawer = styled(Drawer)(({ theme }) => ({ 
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.primary.main,
        },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  height: '2rem',
  borderRadius: '0.2rem',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: '#f8f8f8', 
  },
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    color: theme.palette.text.secondary,
    fontWeight: 400,
    fontSize: '1rem',
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginRight: theme.spacing(-3),
  '& .MuiSvgIcon-root': {
    fontSize: '1.4rem',
    transition: 'color 0.3s ease',
  },
  [`${StyledListItemButton}:hover &`]: {
    color: '#f8f8f8',
  },
}));

export default function SideBar() {
  const theme = useTheme();

  return (
    <StyledDrawer
      variant="permanent"
    >
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <List>
          <ListItem disablePadding>
            <StyledListItemButton>
              <StyledListItemIcon>
                <DashboardIcon />
              </StyledListItemIcon>
              <StyledListItemText primary="Dashboard" />
            </StyledListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <StyledListItemButton>
              <StyledListItemIcon>
                <HomeIcon />
              </StyledListItemIcon>
              <StyledListItemText primary="Home" />
            </StyledListItemButton>
          </ListItem>
        </List>
      </Box>
    </StyledDrawer>
  );
}
