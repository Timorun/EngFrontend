import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Paper, Typography, Box } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard'); // Redirect to Dashboard
  };

  return (
    <Grid container alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Paper elevation={10} style={{ padding: '20px' }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <BookIcon color="primary" style={{ fontSize: 60 }} />
            <Typography variant="h5" style={{ margin: '20px' }}>Credentials</Typography>
            <TextField label="Username" variant="outlined" margin="normal" fullWidth required />
            <TextField label="Password" variant="outlined" margin="normal" fullWidth required type="password" />
            <Button variant="contained" color="primary" onClick={handleLogin} fullWidth style={{ margin: '20px 0' }}>
              Login
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
