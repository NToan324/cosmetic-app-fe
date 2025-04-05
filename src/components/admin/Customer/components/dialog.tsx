import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { MdHistory, MdOutlineCancel } from "react-icons/md";
import { LuRecycle } from "react-icons/lu";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";


// Định nghĩa kiểu dữ liệu cho Customer
interface Customer {
  id: number;
  name: string;
  phone: string;
  dateJoined: Date;
  transaction: number;
  point: number;
  rank: "Bronze" | "Silver" | "Gold" | "Diamond";
}

// Props cho dialog
interface CustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  customer?: Customer | null;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  customer,
}) => {
  // Sử dụng string cho date để dễ hiển thị trong input type="date"
  const [formData, setFormData] = useState({
    id: customer ? customer.id : 0,
    name: customer?.name || "",
    phone: customer?.phone || "",
    dateJoined: customer ? customer.dateJoined.toISOString().slice(0, 10) : "",
    transaction: customer?.transaction || 0,
    point: customer?.point || 0,
    rank: customer?.rank || "Bronze",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        dateJoined: customer.dateJoined.toISOString().slice(0, 10),
        transaction: customer.transaction,
        point: customer.point,
        rank: customer.rank,
      });
    } else {
      setFormData({
        id: 0,
        name: "",
        phone: "",
        dateJoined: "",
        transaction: 0,
        point: 0,
        rank: "Bronze",
      });
    }
  }, [customer]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Chuyển dateJoined về kiểu Date
    const customerData: Customer = {
      id: formData.id,
      name: formData.name,
      phone: formData.phone,
      dateJoined: new Date(formData.dateJoined),
      transaction: Number(formData.transaction),
      point: Number(formData.point),
      rank: formData.rank as Customer["rank"],
    };
    onSave(customerData);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && customer) {
      onDelete(customer);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>
        {customer ? "Customer Detail" : "Add Customer"}
      </DialogTitle>
      <div className="border-t border-gray-300 w-full "></div>
      <DialogContent>
        {customer ? (<>
        <Grid container columnSpacing={2}>
            <Grid size={{xs: 12, md:4}}>
                <TextField fullWidth margin="dense" label="Phone Number" name="phone" value={formData.phone} onChange={handleChange}/>
            </Grid>
            <Grid size={{xs: 12, md:8}}>
                <TextField fullWidth margin="dense" label="Name" name="name" value={formData.name} onChange={handleChange}/>
            </Grid>
        </Grid>
        <Grid container columnSpacing={2}>
            <Grid size={{xs: 12, md:4}}>
                <TextField fullWidth margin="dense" label="Transaction" name="transaction" value={formData.transaction} onChange={handleChange} disabled/>
            </Grid>
            <Grid size={{xs: 12, md:4}}>
                <TextField fullWidth margin="dense" label="Point" name="point" value={formData.point} onChange={handleChange} disabled/>
            </Grid>
            <Grid size={{xs: 12, md:4}}>
                <TextField fullWidth margin="dense" label="Rank" name="rank" value={formData.rank} onChange={handleChange} disabled/>
            </Grid>
        </Grid>
        <Grid container columnSpacing={2}>
            <Grid size={{xs: 12, md:4}}>
                <TextField fullWidth margin="dense" label="Date Joined" name="dateJoined" value={formData.dateJoined} onChange={handleChange} disabled/>
            </Grid>
            <Grid size={{xs: 12, md:4}} className='flex justify-center my-2'>
              <Button variant="contained" fullWidth className="!bg-gray-400">Transaction History</Button>
            </Grid>
            <Grid size={{xs: 12, md:4}} className='flex justify-center my-2'>
              <Button variant="contained" fullWidth>Reset Password</Button>
            </Grid>
        </Grid>
        </>):(<>
            <Grid container columnSpacing={2}>
            <Grid size={{xs: 12, md:4}}>
                <TextField fullWidth margin="dense" label="Phone Number" name="phone" value={formData.phone} onChange={handleChange}/>
            </Grid>
            <Grid size={{xs: 12, md:8}}>
                <TextField fullWidth margin="dense" label="Name" name="name" value={formData.name} onChange={handleChange}/>
            </Grid>
        </Grid>
        </>)
        }
      </DialogContent>
      <div className="border-t border-gray-300 w-full "></div>

      <DialogActions className="flex !justify-between">
        {customer ? (
          <>
          <Button variant='contained' className='!bg-gray-400' startIcon={<MdHistory />} onClick={onClose}>
            Edit History
          </Button>
          
          <div className="flex gap-2">
          <Button
              variant="contained"
              color="error"
              startIcon={<CiCircleMinus />}
              onClick={handleDelete}
            >
              Delete
            </Button>
              <Button
                variant="contained"
                startIcon={<MdOutlineCancel />}
                onClick={onClose}
                className="text-white"
              >
                Close
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#4caf50" }}
                startIcon={<LuRecycle />}
                onClick={handleSave}
              >
                Save
              </Button>
          </div>
            
            
          </>
        ) : (
          <>
          <div></div>
          <div className="flex gap-2">
            <Button
              variant="contained"
              startIcon={<MdOutlineCancel />}
              onClick={onClose}
              className="!bg-red-500 text-white"
            >
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<CiCirclePlus />}
              onClick={handleSave}
            >
              Add
            </Button>
          </div>
            
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomerDialog;
