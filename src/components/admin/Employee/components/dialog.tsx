import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import { MdOutlineCancel } from 'react-icons/md';
import { LuRecycle } from 'react-icons/lu';
import { CiCirclePlus } from 'react-icons/ci';
import { CiCircleMinus } from 'react-icons/ci';
import DEFAULT from '@/assets/images/default_avatar.jpg';
import employeeService from '@/services/employeeAPI';

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
  disable: boolean;
  image_url?: string;
  edit_history: {
    edited_at: string;
    edited_by: { _id: string; name: string };
    reason: string;
    changes: {
      before: any;
      after: any;
    };
  }[];
}

interface EmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (employee: any) => void;
  employee?: Employee | null;
}

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({ open, onClose, onSave, employee }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ['SALESTAFF'],
    type: 'FULLTIME',
    active: true,
    disable: false,
    image_url: DEFAULT,
    created_by: employee ? undefined : '67f2d1bcbbc14768a52717df', // Sửa thành _id của Admin
    edited_by: employee ? '67f2d1bcbbc14768a52717df' : undefined, // Sửa thành _id của Admin
    reason: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [editHistory, setEditHistory] = useState<any[]>([]);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.userId?.name || '',
        email: employee.userId?.email || '',
        phone: employee.userId?.phone || '',
        role: employee.role || ['SALESTAFF'],
        type: employee.type || 'FULLTIME',
        active: employee.userId?.active ?? true,
        disable: employee.disable ?? false,
        image_url: employee.image_url || DEFAULT,
        created_by: undefined,
        edited_by: '67f2d1bcbbc14768a52717df', // Sửa thành _id của Admin
        reason: '',
      });
      setEditHistory(employee.edit_history || []);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: ['SALESTAFF'],
        type: 'FULLTIME',
        active: true,
        disable: false,
        image_url: DEFAULT,
        created_by: '67f2d1bcbbc14768a52717df', // Sửa thành _id của Admin
        edited_by: undefined,
        reason: '',
      });
      setEditHistory([]);
    }
    setErrors({});
  }, [employee]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'active' || name === 'disable' ? value === 'true' : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image_url: imageUrl }));
    }
  };

  const validateForm = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Tên không được để trống';
    if (!formData.email) newErrors.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.phone) newErrors.phone = 'Số điện thoại không được để trống';
    if (!formData.reason) newErrors.reason = 'Lý do không được để trống';
    if (formData.role.length === 0) newErrors.role = 'Vai trò không được để trống';
    if (!formData.type) newErrors.type = 'Loại không được để trống';

    try {
      const response = await employeeService.getEmployees();
      const employees = response.data;
      const existingEmail = employees.find((emp: Employee) => emp.userId.email === formData.email && emp._id !== employee?._id);
      const existingPhone = employees.find((emp: Employee) => emp.userId.phone === formData.phone && emp._id !== employee?._id);
      if (existingEmail) newErrors.email = 'Email đã tồn tại';
      if (existingPhone) newErrors.phone = 'Số điện thoại đã tồn tại';
    } catch (error) {
      console.error('Lỗi khi kiểm tra trùng lặp:', error);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!(await validateForm())) return;
    const employeeData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      type: formData.type,
      image_url: formData.image_url,
      reason: formData.reason,
      ...(employee ? { edited_by: formData.edited_by } : { created_by: formData.created_by }),
    };
    console.log('Employee data before sending:', employeeData);
    onSave(employeeData);
    onClose();
  };

  const handleDelete = () => {
    if (!employee) return;
    const deleteData = {
      deleted_by: '67f2d1bcbbc14768a52717df', // Sửa thành _id của Admin
      reason: formData.reason || 'Xóa bởi admin',
    };
    onSave({ ...employee, ...deleteData });
    onClose();
  };

  // Giữ nguyên phần giao diện render
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {employee ? `Chi tiết nhân viên: ${employee._id}` : 'Thêm nhân viên'}
      </DialogTitle>
      <Box className="border-t border-gray-300 w-full" />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <img
                src={formData.image_url}
                alt="Avatar"
                style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <Button variant="contained" component="label" sx={{ mt: 1 }}>
                Chọn ảnh
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Tên"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ '& .MuiFormHelperText-root': { color: 'red' } }}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ '& .MuiFormHelperText-root': { color: 'red' } }}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              sx={{ '& .MuiFormHelperText-root': { color: 'red' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              fullWidth
              margin="dense"
              label="Vai trò"
              name="role"
              multiple
              value={formData.role}
              onChange={handleSelectChange}
              error={!!errors.role}
            >
              <MenuItem value="MANAGER">Quản lý</MenuItem>
              <MenuItem value="SALESTAFF">Nhân viên bán hàng</MenuItem>
              <MenuItem value="CONSULTANT">Tư vấn viên</MenuItem>
            </Select>
            {errors.role && <Typography color="error">{errors.role}</Typography>}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              fullWidth
              margin="dense"
              label="Loại"
              name="type"
              value={formData.type}
              onChange={handleSelectChange}
              error={!!errors.type}
            >
              <MenuItem value="PARTTIME">Bán thời gian</MenuItem>
              <MenuItem value="FULLTIME">Toàn thời gian</MenuItem>
            </Select>
            {errors.type && <Typography color="error">{errors.type}</Typography>}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormLabel component="legend">Hoạt động</FormLabel>
            <RadioGroup row name="active" value={formData.active.toString()} onChange={handleChange}>
              <FormControlLabel value="true" control={<Radio />} label="Hoạt động" />
              <FormControlLabel value="false" control={<Radio />} label="Không hoạt động" />
            </RadioGroup>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormLabel component="legend">Tắt</FormLabel>
            <RadioGroup row name="disable" value={formData.disable.toString()} onChange={handleChange}>
              <FormControlLabel value="true" control={<Radio />} label="Tắt" />
              <FormControlLabel value="false" control={<Radio />} label="Bật" />
            </RadioGroup>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Lý do"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              error={!!errors.reason}
              helperText={errors.reason}
              sx={{ '& .MuiFormHelperText-root': { color: 'red' } }}
            />
          </Grid>
        </Grid>

        {editHistory.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6">Lịch sử chỉnh sửa</Typography>
            {editHistory.map((history, index) => (
              <Box key={index} mt={2}>
                <Typography variant="body1">
                  <strong>Thời gian chỉnh sửa:</strong> {new Date(history.edited_at).toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Người chỉnh sửa:</strong> {history.edited_by?.name || 'Admin'} (ID: {history.edited_by?._id || '67f2d1bcbbc14768a52717dd'})
                </Typography>
                <Typography variant="body1">
                  <strong>Lý do:</strong> {history.reason}
                </Typography>
                <Typography variant="body1">
                  <strong>Thay đổi:</strong>
                </Typography>
                {history.changes?.before && history.changes?.after ? (
                  Object.entries(history.changes.after).map(([key, value]) => (
                    <Typography key={key} variant="body2">
                      {key}: {history.changes.before[key] ?? 'N/A'} → {value ?? 'N/A'}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">Không có thay đổi chi tiết</Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <Box className="border-t border-gray-300 w-full" />
      <DialogActions className="flex !justify-between">
        {employee ? (
          <>
            <div className="flex gap-2">
              <Button variant="contained" color="error" startIcon={<CiCircleMinus />} onClick={handleDelete}>
                Xóa
              </Button>
              <Button variant="contained" startIcon={<MdOutlineCancel />} onClick={onClose} className="text-white">
                Đóng
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#4caf50' }}
                startIcon={<LuRecycle />}
                onClick={handleSave}
              >
                Lưu
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              className="!bg-red-500 text-white"
              startIcon={<MdOutlineCancel />}
              onClick={onClose}
            >
              Đóng
            </Button>
            <Button variant="contained" startIcon={<CiCirclePlus />} onClick={handleSave}>
              Thêm
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDialog;