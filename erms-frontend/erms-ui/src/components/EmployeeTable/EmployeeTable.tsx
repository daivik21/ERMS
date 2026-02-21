import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
}

interface EmployeeTableProps {
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: number) => void;
  onView?: (employee: Employee) => void;
}

const dummyData: Employee[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: '2022-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    department: 'HR',
    position: 'HR Manager',
    joinDate: '2021-06-20',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    department: 'Finance',
    position: 'Financial Analyst',
    joinDate: '2020-03-10',
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    joinDate: '2022-11-05',
  },
  {
    id: 5,
    name: 'Robert Brown',
    email: 'robert@example.com',
    department: 'Engineering',
    position: 'DevOps Engineer',
    joinDate: '2021-09-12',
  },
];

const EmployeeTable: React.FC<EmployeeTableProps> = ({ onEdit, onDelete, onView }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedRows = dummyData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Join Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((employee) => (
              <TableRow key={employee.id} hover>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.joinDate}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onView?.(employee)}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => onEdit?.(employee)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete?.(employee.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={dummyData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default EmployeeTable;
