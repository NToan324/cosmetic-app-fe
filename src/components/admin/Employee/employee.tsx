import { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Pagination,
  Stack,
  Box,
  Chip,
} from '@mui/material';
import { CiCirclePlus } from 'react-icons/ci';
import { IoSearch } from 'react-icons/io5';
import EmployeeDialog from '@/components/admin/Employee/components/dialog';
import employeeService from '@/services/employeeAPI';
import DEFAULT from '@/assets/images/default_avatar.jpg';

interface Employee {
  _id: string;
  userId: {
    name: string;
    email: string;
    phone: string;
    active: boolean;
  };
  role: string[];
  type: string;
  active: boolean;
  disable: boolean;
  avatar?: string;
  edit_history: {
    edited_at: string;
    edited_by: string;
    reason: string;
    changes: {
      before: any;
      after: any;
    };
  }[];
}

const EmployeePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getEmployees();
        setEmployees(data.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleFilterClick = (event: MouseEvent<HTMLButtonElement>, column: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedColumn(column);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedColumn(null);
  };

  const handleCheckboxToggle = (value: string) => {
    if (!selectedColumn) return;
    setFilters((prev) => {
      const current = prev[selectedColumn] || [];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [selectedColumn]: newValues };
    });
    setPage(1);
  };

  const clearFilter = (column: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[column];
      return newFilters;
    });
    setPage(1);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      searchTerm === '' ||
      employee.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.userId.phone.includes(searchTerm);
    const matchesFilters = Object.keys(filters).every((col) => {
      if (filters[col].length === 0) return true;
      let employeeValue: string;
      switch (col) {
        case 'name':
          employeeValue = employee.userId.name;
          break;
        case 'phone':
          employeeValue = employee.userId.phone;
          break;
        case 'email':
          employeeValue = employee.userId.email;
          break;
        case 'role':
          employeeValue = employee.role.join(', ');
          break;
        case 'type':
          employeeValue = employee.type;
          break;
        default:
          employeeValue = '';
      }
      return filters[col].includes(employeeValue);
    });
    return matchesSearch && matchesFilters;
  });

  const getUniqueOptions = (column: string): string[] => {
    const options = filteredEmployees.map((employee) => {
      switch (column) {
        case 'name':
          return employee.userId.name;
        case 'phone':
          return employee.userId.phone;
        case 'email':
          return employee.userId.email;
        case 'role':
          return employee.role.join(', ');
        case 'type':
          return employee.type;
        default:
          return '';
      }
    }).filter((option): option is string => option !== undefined);
    return Array.from(new Set(options));
  };

  const openDialogForAdd = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const openDialogForEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  
  // Trong component
  const handleSaveEmployee = async (data: any) => {
    try {
      if (selectedEmployee) {
        await employeeService.updateEmployee(selectedEmployee._id, data);
        toast.success('Cập nhật nhân viên thành công');
      } else {
        await employeeService.createEmployee(data);
        toast.success('Thêm nhân viên thành công');
      }
      const response = await employeeService.getEmployees();
      setEmployees(response.data);
      setDialogOpen(false);
    } catch (error: any) {
      console.error('Lỗi khi lưu nhân viên:', error.response?.data?.message || 'An error occurred');
      toast.error(error.response?.data?.message || 'Lỗi khi lưu nhân viên');
    }
  };

  const paginatedEmployees = filteredEmployees.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  return (
    <div className='p-4 pt-8'>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Button variant='contained' color='success' startIcon={<CiCirclePlus />} onClick={openDialogForAdd}>
          ADD EMPLOYEE
        </Button>
        <Box>
          {Object.entries(filters).map(([column, values]) =>
            values.length > 0 ? (
              <Chip
                key={column}
                label={`${values.join(', ')}`}
                onDelete={() => clearFilter(column)}
                style={{ marginRight: 8 }}
              />
            ) : null
          )}
        </Box>
      </Box>
      <div className='border-t border-gray-300 w-full'></div>
      <Box display='flex' justifyContent='space-between' alignItems='center' my={1}>
        <h2 style={{ textAlign: 'left', marginBottom: '10px', fontSize: '1.75rem' }}>Employees</h2>
        <div className='bg-white flex items-center justify-between gap-2 p-2 rounded-2xl px-4 md:w-[300px] md:h-[50px] md:bg-gray-100'>
          <IoSearch size={25} color='black' />
          <input
            type='text'
            placeholder='Search'
            className='text-black border-none outline-none w-full hidden md:block'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='employee table'>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>
                Name
                <Button className='w-[0.5rem]' onClick={(e) => handleFilterClick(e, 'name')}>
                  {'>'}
                </Button>
              </TableCell>
              <TableCell>
                Phone Number
                <Button onClick={(e) => handleFilterClick(e, 'phone')}>{'>'}</Button>
              </TableCell>
              <TableCell>
                Email
                <Button onClick={(e) => handleFilterClick(e, 'email')}>{'>'}</Button>
              </TableCell>
              <TableCell>
                Role
                <Button onClick={(e) => handleFilterClick(e, 'role')}>{'>'}</Button>
              </TableCell>
              <TableCell>
                Type
                <Button onClick={(e) => handleFilterClick(e, 'type')}>{'>'}</Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.map((employee, index) => (
              <TableRow
                key={employee._id}
                sx={{ backgroundColor: index % 2 === 0 ? 'action.hover' : 'inherit' }}
                onClick={() => openDialogForEdit(employee)}
              >
                <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={employee.avatar || DEFAULT} alt='employee' style={{ width: 24, height: 24 }} />
                    <div>
                      {employee.userId.name} <br />
                      <span style={{ color: 'gray', fontSize: '0.875rem' }}>{employee._id}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.userId.phone}</TableCell>
                <TableCell>{employee.userId.email}</TableCell>
                <TableCell>{employee.role.join(', ')}</TableCell>
                <TableCell>{employee.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {selectedColumn &&
          getUniqueOptions(selectedColumn).map((option, idx) => {
            const checked = filters[selectedColumn]?.includes(option) || false;
            return (
              <MenuItem key={idx}>
                <FormControlLabel
                  control={<Checkbox checked={checked} onChange={() => handleCheckboxToggle(option)} />}
                  label={option}
                />
              </MenuItem>
            );
          })}
        {selectedColumn && (
          <MenuItem
            onClick={() => {
              clearFilter(selectedColumn);
              handleMenuClose();
            }}
          >
            Clear Filter
          </MenuItem>
        )}
      </Menu>
      <Stack spacing={2} sx={{ marginTop: 2, alignItems: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          variant='outlined'
          shape='rounded'
        />
      </Stack>
      <EmployeeDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default EmployeePage;