import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployeeByName,
  getEmployeesBySalaryRange,
} from '../../services';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
}

interface EmployeeTableProps {
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: number) => void;
  onView?: (employee: Employee) => void;
}

const emptyForm: Employee = {
  id: 0,
  name: '',
  email: '',
  department: '',
  salary: 0,
};

const EmployeeTable: React.FC<EmployeeTableProps> = ({ onEdit, onDelete, onView }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Employee>(emptyForm);
  const [dialogError, setDialogError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchEmployeePage = async (pageNumber: number, size: number) => {
    if (isFiltered) return;
    setLoading(true);
    setError('');
    try {
      const pageData = await getEmployees(pageNumber, size);
      if (pageData?.content) {
        setEmployees(pageData.content);
        setTotalCount(pageData.totalElements ?? pageData.content.length);
      } else if (Array.isArray(pageData)) {
        setEmployees(pageData);
        setTotalCount(pageData.length);
      } else {
        setEmployees([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employees');
      setEmployees([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFiltered) {
      fetchEmployeePage(page, rowsPerPage);
    }
  }, [page, rowsPerPage, isFiltered]);

  const handleSearchChange = useCallback(
    (name: string) => {
      setSearchName(name);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        if (!name.trim()) {
          setIsFiltered(false);
          setPage(0);
          fetchEmployeePage(0, rowsPerPage);
          return;
        }

        setLoading(true);
        setError('');
        try {
          const result = await searchEmployeeByName(name);
          if (Array.isArray(result)) {
            setEmployees(result);
            setTotalCount(result.length);
            setIsFiltered(true);
            setPage(0);
          } else {
            setError('Invalid search response: Expected an array');
          }
        } catch (err: any) {
          setError(err.message || 'Search failed');
        } finally {
          setLoading(false);
        }
      }, 500);
    },
    [rowsPerPage]
  );

  const handleApplySalaryFilter = async () => {
    const min = parseFloat(minSalary);
    const max = parseFloat(maxSalary);
    if (isNaN(min) || isNaN(max) || min > max) {
      setError('Please enter valid salary range');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await getEmployeesBySalaryRange(min, max);
      if (Array.isArray(result)) {
        setEmployees(result);
        setTotalCount(result.length);
        setIsFiltered(true);
        setPage(0);
      } else {
        setError('Invalid filter response: Expected an array');
      }
    } catch (err: any) {
      setError(err.message || 'Filter failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchName('');
    setMinSalary('');
    setMaxSalary('');
    setIsFiltered(false);
    setPage(0);
    fetchEmployeePage(0, rowsPerPage);
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setFormData(emptyForm);
    setDialogError('');
    setDialogOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setIsEditing(true);
    setFormData(employee);
    setDialogError('');
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogError('');
  };

  const handleFormChange = (field: keyof Employee, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.department || !formData.salary) {
      setDialogError('Please fill all fields.');
      return;
    }

    try {
      setDialogError('');
      if (isEditing) {
        await updateEmployee(formData.id, {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          salary: formData.salary,
        });
      } else {
        await createEmployee({
          name: formData.name,
          email: formData.email,
          department: formData.department,
          salary: formData.salary,
        });
      }
      setDialogOpen(false);
      fetchEmployeePage(page, rowsPerPage);
    } catch (err: any) {
      setDialogError(err.message || 'Save failed');
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedDeleteId == null) return;
    try {
      await deleteEmployee(selectedDeleteId);
      setConfirmOpen(false);
      setSelectedDeleteId(null);
      if (onDelete) {
        onDelete(selectedDeleteId);
      }
      fetchEmployeePage(page, rowsPerPage);
    } catch (err: any) {
      setDialogError(err.message || 'Delete failed');
    }
  };

  const handleDeleteCancel = () => {
    setConfirmOpen(false);
    setSelectedDeleteId(null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ justifyContent: 'space-between', display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <TextField
              label="Search by Name"
              value={searchName}
              onChange={(e) => handleSearchChange(e.target.value)}
              size="small"
              sx={{ minWidth: 220 }}
            />
            <Button startIcon={<ClearIcon />} variant="text" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Box>
          <Button startIcon={<AddIcon />} variant="contained" color="primary" onClick={handleAddClick}>
            Add Employee
          </Button>
        </Box>

        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <TextField
            label="Min Salary"
            type="number"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
          />
          <TextField
            label="Max Salary"
            type="number"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
          />
          <Button variant="outlined" onClick={handleApplySalaryFilter}>
            Apply Salary Filter
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Salary</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.name || '-'}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.salary}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton size="small" color="primary" onClick={() => onView?.(employee)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" color="warning" onClick={() => handleEditClick(employee)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(employee.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {employees.length === 0 && (
            <Typography sx={{ mt: 2, textAlign: 'center' }}>No employees found.</Typography>
          )}

          {!isFiltered && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1, display: 'grid', gap: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Department"
              value={formData.department}
              onChange={(e) => handleFormChange('department', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Salary"
              type="number"
              value={formData.salary}
              onChange={(e) => handleFormChange('salary', Number(e.target.value))}
              fullWidth
              required
            />
            {dialogError && <Alert severity="error">{dialogError}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this employee? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeTable;