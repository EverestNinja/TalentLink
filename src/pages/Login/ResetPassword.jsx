import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Paper } from "@mui/material";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Reset link sent! Please check your email.");
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
        px: 2,
        marginTop: "100px",
        marginBottom: "20px"
      }}
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, maxWidth: 420, width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Forgot Password
        </Typography>

        <Typography variant="body2" color="text.secondary" align="center" mb={3}>
          Enter your registered email. We'll send you a link to reset your password.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" fullWidth variant="contained" className="!bg-[#8F2BE0]">
            Send Reset Link
          </Button>
        </form>

        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
