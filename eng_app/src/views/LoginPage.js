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
  Divider,
} from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import axiosInstance from "../axiosInstance";

function LoginPage() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Registration state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token); // Save token
        navigate("/dashboard"); // Redirect to Dashboard
      }
    } catch (err) {
      // More specific error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        setError(
          err.response.data.msg || "Login failed. Bad email or password."
        );
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request
        setError("Error setting up request.");
      }
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        email: registerEmail,
        password: registerPassword,
      });
      if (response.status === 201) {
        setRegisterSuccess("Registration successful! Please log in.");
        setIsRegistering(false); // Switch back to login form
        setEmail(registerEmail);
        setPassword("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterError("");
      }
    } catch (err) {
      if (err.response) {
        // Handle specific server responses
        if (err.response.status === 409) {
          setRegisterError("Email already registered.");
        } else {
          setRegisterError("Registration failed. Please try again.");
        }
      } else {
        setRegisterError("Registration failed. Please try again.");
      }
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
              {isRegistering ? "Register" : "Login"}
            </Typography>

            {registerSuccess && (
              <Alert
                severity="success"
                style={{ margin: "20px 0", width: "100%" }}
              >
                {registerSuccess}
              </Alert>
            )}
            {isRegistering ? (
              // Registration form
              <>
                <TextField
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                {registerError && (
                  <Alert severity="error" style={{ margin: "20px 0" }}>
                    {registerError}
                  </Alert>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRegister}
                  fullWidth
                  style={{ margin: "20px 0" }}
                >
                  Register
                </Button>
              </>
            ) : (
              // Login form
              <>
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
              </>
            )}
            <Divider style={{ width: "100%", margin: "20px 0" }} />
            <Button
              color="secondary"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
