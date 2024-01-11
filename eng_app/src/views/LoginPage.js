import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    console.log("email", email);
    console.log("password", password);
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token); // Save token
        navigate("/dashboard"); // Redirect to Dashboard
      }
    } catch (error) {
      setError("Login failed. Bad email or password.");
    }
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Paper elevation={10} style={{ padding: "20px" }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <BookIcon color="primary" style={{ fontSize: 60 }} />
            <Typography variant="h5" style={{ margin: "20px" }}>
              Credentials
            </Typography>
            <TextField
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Alert severity="error" style={{ margin: "20px 0" }}>
                {error}
              </Alert>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              fullWidth
              style={{ margin: "20px 0" }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
