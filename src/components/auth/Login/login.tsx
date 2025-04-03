import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Banner from '@/assets/images/login_banner.jpg'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className='!bg-white'>
    <Grid container sx={{ height: '100vh' }}>
      {/* Bên trái: Form đăng nhập */}
      <Grid
        size={{xs:12, md:6}}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' },
          p: {xs: 4, md: 12}
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ width: '100%', textAlign: { xs: 'center', md: 'left' } }}
        >
          Login
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 2,
            color: 'text.secondary',
            width: '100%',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Please! Fill your account to continue
        </Typography>

        <Box component="form" noValidate sx={{ width: '100%', maxWidth: 400 }}>
          <TextField
            fullWidth
            label="User"
            variant="standard"
            margin="normal"
            sx={{
              '& .MuiInput-underline:after': {
                borderBottomColor: 'orange', // Màu cam khi focus
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'orange', // Màu chữ của label khi focus
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="standard"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiInput-underline:after': {
                borderBottomColor: 'orange', // Màu cam khi focus
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'orange', // Màu chữ của label khi focus
              },
            }}
          />
          <p className='text-right text-gray-400'>Forgot password?</p>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Button  variant="contained" sx={{ mt: 2 , px: 4, backgroundColor: "orange"}}>
               Login
            </Button>
            <p>Don't have an account? <Button href='/signup'>Sign Up</Button></p> 
          </Box>
            
          
        </Box>
      </Grid>

      {/* Bên phải: Hình minh họa/biểu đồ */}
      <Grid
        size={{xs:12, md:6}}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        
        <Box
          sx={{
            display: {xs: 'none', md: 'block'},

            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: 2,
          }}
        ><img src = {Banner} style={{
          width: '100%',
          height: '100%',
          backgroundImage:
            "@assets/images/login_banner.jpg",
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: 2,
        }}/></Box>
      </Grid>
    </Grid>
    </div>
  );
};

export default Login;
