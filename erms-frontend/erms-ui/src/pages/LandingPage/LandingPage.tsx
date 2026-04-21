import React, { useState } from 'react';
import { Box, Toolbar, Container, Typography } from '@mui/material';
import Header from '../../components/Header/Header.tsx';
import Sidebar from '../../components/Sidebar/Sidebar.tsx';
import EmployeeTable from '../../components/EmployeeTable/EmployeeTable.tsx';

interface LandingPageProps {
  onLogout: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Employees');

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleMenuItemClick = (itemName: string) => {
    setActiveSection(itemName);
    setSidebarOpen(false);
  };

  const handleEdit = (employee: any) => {
    console.log('Edit employee:', employee);
  };

  const handleDelete = (id: number) => {
    console.log('Delete employee:', id);
  };

  const handleView = (employee: any) => {
    console.log('View employee:', employee);
    alert(`View details for ${employee.name}`);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header */}
      <Header onMenuToggle={handleMenuToggle} userEmail="admin@erms.com" onLogout={onLogout} />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} onItemClick={handleMenuItemClick} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 280px)`, xs: '100%' },
          minHeight: '100vh',
          backgroundColor: '#fafafa',
        }}
      >
        <Toolbar /> {/* This adds spacing below the fixed header */}

        <Container maxWidth="lg">
          {/* Section Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {activeSection}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mt: 1 }}>
              Manage your {activeSection.toLowerCase()} effectively
            </Typography>
          </Box>

          {/* Content Based on Active Section */}
          {activeSection === 'Employees' || activeSection === 'Dashboard' ? (
            <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Employee List
              </Typography>
              <EmployeeTable onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
            </Box>
          ) : activeSection === 'Reports' ? (
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6">Reports Section</Typography>
              <Typography variant="body2" sx={{ color: '#999', mt: 2 }}>
                Reports functionality coming soon...
              </Typography>
            </Box>
          ) : activeSection === 'Settings' ? (
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6">Settings Section</Typography>
              <Typography variant="body2" sx={{ color: '#999', mt: 2 }}>
                Settings functionality coming soon...
              </Typography>
            </Box>
          ) : null}
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;