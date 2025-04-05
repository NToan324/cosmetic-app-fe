import { Avatar, Button,TextField } from "@mui/material";
import { IoKeyOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
const Password_Setting = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <Avatar sx={{ width: 60, height: 60, mt: 4, mb: 6 }} style={{ backgroundColor: 'orange' }}>
            <IoKeyOutline style={{ fontSize: 46 }} />
          </Avatar>
          <h1 className="text-2xl font-b">Forgot Password</h1>
          <p className="text-gray-600 mt-2 text-center">
            Enter your phone number or email to retrieve your old password via SMS
          </p>
        </div>

        {/*  Password */}
        <TextField
          fullWidth
          label="Information"
          variant="standard"
          margin="normal"
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
          className="!mt-4"
          style={{ color: 'white', backgroundColor: 'orange' }}
        >
          Get Password
        </Button>
        <div style={{width: '100%', textAlign: 'left', marginTop: '12px'}}>
            <NavLink to='/auth/login' className='!mt-8 text-primary'>
                Back to Login
            </NavLink>
        </div>
        
      </div>
    </div>
  );
};

export default Password_Setting;
