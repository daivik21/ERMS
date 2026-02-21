import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onItemClick?: (itemName: string) => void;
}

const DRAWER_WIDTH = 280;

const menuItems = [
  { name: 'Dashboard', icon: DashboardIcon },
  { name: 'Employees', icon: PeopleIcon },
  { name: 'Reports', icon: AssignmentIcon },
  { name: 'Settings', icon: SettingsIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, onItemClick }) => {
  const handleMenuItemClick = (itemName: string) => {
    onItemClick?.(itemName);
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                onClick={() => handleMenuItemClick(item.name)}
                sx={{
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                  },
                }}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                '&:hover': {
                  backgroundColor: '#ffebee',
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon sx={{ color: '#d32f2f' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: '#d32f2f' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export { DRAWER_WIDTH };
export default Sidebar;
