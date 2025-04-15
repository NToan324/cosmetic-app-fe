import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

type ConfirmModalDeleteProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmModalDelete({ open, onClose, onConfirm }: ConfirmModalDeleteProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận xóa khách hàng</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn xóa khách hàng này không?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
