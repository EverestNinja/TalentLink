import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MentorIcon from "@mui/icons-material/School";
import OrgIcon from "@mui/icons-material/Business";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signupWithEmail, signupWithGoogle, getRedirectPath } from "./process";

import normalBG from "../../assets/normal.svg";
import userBG from "../../assets/userbg.svg";
import mentorBG from "../../assets/Mentor.svg";
import orgBG from "../../assets/Org.svg";

const roles = [
  {
    label: "User",
    description: "Find internships, projects & mentors",
    icon: <PersonIcon sx={{ color: "#ffff", fontSize: 40 }} />,
    role: "user",
    bg: userBG,
  },
  {
    label: "Mentor",
    description: "Guide talent and share your experience",
    icon: <MentorIcon sx={{ color: "#ffff", fontSize: 40 }} />,
    role: "mentor",
    bg: mentorBG,
  },
  {
    label: "Organization",
    description: "Post projects & discover skilled individuals",
    icon: <OrgIcon sx={{ color: "#ffff", fontSize: 40 }} />,
    role: "organization",
    bg: orgBG,
  },
];

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [hoveredRole, setHoveredRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const getBackgroundImage = () => {
    if (selectedRole) {
      const role = roles.find((r) => r.role === selectedRole);
      return role ? role.bg : normalBG;
    }
    const role = roles.find((r) => r.role === hoveredRole);
    return role ? role.bg : normalBG;
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation is now handled in process.jsx

  // User document creation is now handled in process.jsx

  const handleSignupSuccess = (result) => {
    setSuccess(result.message);
    
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Determine redirect path based on whether this is a new user or login
    const redirectPath = getRedirectPath(result.userData.role, result.userData, result.isNewUser);
    
    // Navigate after successful signup
    setTimeout(() => {
      navigate(redirectPath);
    }, 1500);
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signupWithEmail(formData, selectedRole);
      handleSignupSuccess(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signupWithGoogle(selectedRole);
      handleSignupSuccess(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRoles = () => {
    setShowForm(false);
    setSelectedRole(null);
    setError("");
    setSuccess("");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(to right, #b263fc, #8928e2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        px: 2,
        py: 6,
      }}
    >
      {/* Dynamic Background Image */}
      <Box
        component="img"
        src={getBackgroundImage()}
        alt="Background Illustration"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: "60%" },
          opacity: 0.4,
          zIndex: 0,
          pointerEvents: "none",
          transition: "all 0.3s ease",
          overflow: "hidden",
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
      />

      {/* Header */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          fontWeight: "bold",
          color: "white",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        Join TalentLink
      </Typography>

      <Box sx={{ mt: { xs: 10, md: 15 }, zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {!showForm ? (
          <>
            <Typography
              variant="body1"
              sx={{ color: "#f5f5f5", mb: 4, textAlign: "center", zIndex: 1 }}
            >
              Choose your role to get started
            </Typography>

            {/* Role Selection Cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 3,
                width: "100%",
                maxWidth: 1000,
                zIndex: 1,
              }}
            >
              {roles.map(({ label, description, icon, role }) => (
                <Card
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  onMouseEnter={() => setHoveredRole(role)}
                  onMouseLeave={() => setHoveredRole(null)}
                  sx={{
                    textAlign: "center",
                    p: 3,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-4px)",
                    },
                    background: "linear-gradient(to right, #8928e2, #a133d7)",
                    borderRadius: 3,
                    color: "white",
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    {icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
                    Sign up as {label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                    {description}
                  </Typography>
                </Card>
              ))}
            </Box>
          </>
        ) : (
          /* Signup Form */
          <Card
            sx={{
              p: 4,
              maxWidth: 500,
              width: "100%",
              background: "rgba(255,255,255,0.95)",
              borderRadius: 3,
              zIndex: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Button
                onClick={handleBackToRoles}
                sx={{ mr: 2, minWidth: "auto", p: 1 }}
              >
                ← Back
              </Button>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Sign up as {roles.find(r => r.role === selectedRole)?.label}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {/* Google Signup Button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignup}
              disabled={loading}
              sx={{
                mb: 3,
                py: 1.5,
                borderColor: "#db4437",
                color: "#db4437",
                "&:hover": {
                  borderColor: "#c23321",
                  backgroundColor: "rgba(219, 68, 55, 0.04)",
                },
              }}
              startIcon={<GoogleIcon />}
            >
              {loading ? <CircularProgress size={20} /> : "Continue with Google"}
            </Button>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary">
                OR
              </Typography>
            </Divider>

            {/* Email Signup Form */}
            <Box component="form" onSubmit={handleEmailSignup}>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Box>

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                variant="outlined"
                required
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                variant="outlined"
                required
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: "linear-gradient(to right, #8928e2, #a133d7)",
                  "&:hover": {
                    background: "linear-gradient(to right, #7a1fd8, #9128ce)",
                  },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Create Account"}
              </Button>
            </Box>
          </Card>
        )}

        <Typography
          variant="body1"
          sx={{ color: "#fff", mt: 3, zIndex: 1, textAlign: "center" }}
        >
          Already have an account?{" "}
          <a href="/login" style={{ color: "#fff", textDecoration: "underline" }}>
            Login instead
          </a>
        </Typography>
      </Box>
    </Box>
  );
} 