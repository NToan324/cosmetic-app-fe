import { useState } from "react";
import { Avatar, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { PiWarningDiamondLight } from "react-icons/pi";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

const Password_Setting = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordAgain, setShowNewPasswordAgain] = useState(false);

  const handleToggleOldPassword = () => {
    setShowOldPassword((prev) => !prev);
  };

  const handleToggleNewPassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handleToggleNewPasswordAgain = () => {
    setShowNewPasswordAgain((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Avatar sx={{ width: 60, height: 60, mt: 4, mb: 6 }} style={{ backgroundColor: 'orange' }}>
            <PiWarningDiamondLight style={{ fontSize: 46 }} />
          </Avatar>
          <h1 className="text-2xl font-bold">Change Your Password</h1>
          <p className="text-gray-600 mt-2 text-center">
            You have logged in as an employee for the first time! Please change your password!
          </p>
        </div>

        {/* Old Password */}
        <TextField
          fullWidth
          label="Old Password"
          variant="standard"
          margin="normal"
          type={showOldPassword ? 'text' : 'password'}
          slotProps={{
            input: {
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton onClick={handleToggleOldPassword}>
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            ),
                },
            }}
          sx={{
            '& .MuiInput-underline:after': {
              borderBottomColor: 'orange',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'orange',
            },
          }}
        />

        {/* New Password */}
        <TextField
          fullWidth
          label="New Password"
          variant="standard"
          margin="normal"
          type={showNewPassword ? 'text' : 'password'}
          slotProps={{
            input: {
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton onClick={handleToggleNewPassword}>
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            ),
            },
        }}
          sx={{
            '& .MuiInput-underline:after': {
              borderBottomColor: 'orange',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'orange',
            },
          }}
        />
        {/*  New Password again */}
        <TextField
          fullWidth
          label="Confirm Again"
          variant="standard"
          margin="normal"
          type={showNewPassword ? 'text' : 'password'}
          slotProps={{
            input: {
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton onClick={handleToggleNewPasswordAgain}>
                        {showNewPasswordAgain ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            ),
            },
        }}
          sx={{
            '& .MuiInput-underline:after': {
              borderBottomColor: 'orange',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'orange',
            },
          }}
        />

        <Button
          fullWidth
          className="!mt-8"
          style={{ color: 'white', backgroundColor: 'orange' }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default Password_Setting;
