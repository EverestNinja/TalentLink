import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { loginWithEmail, loginWithGoogle, getRedirectPath } from "./process";

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

export default function RoleBasedLoginPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [hoveredRole, setHoveredRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const handleLoginSuccess = (result) => {
    // Set appropriate success message
    const successMessage = result.isNewUser 
      ? "🎉 Welcome to TalentLink! Account created successfully. Redirecting to complete your profile..."
      : "✅ Welcome back! Login successful. Redirecting to your dashboard...";
    
    setSuccess(successMessage);

    // Reset form
    setFormData({
      email: "",
      password: "",
    });

    // Determine redirect path based on whether this is a new user or login
    const redirectPath = getRedirectPath(
      result.userData.role,
      result.userData,
      result.isNewUser
    );

    // Navigate after successful login/signup with shorter delay for better UX
    setTimeout(() => {
      navigate(redirectPath);
    }, 2000);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginWithEmail(
        formData.email,
        formData.password,
        selectedRole
      );
      handleLoginSuccess(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await loginWithGoogle(selectedRole);
      handleLoginSuccess(result);
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
      email: "",
      password: "",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // background: "linear-gradient(to right, #b263fc, #8928e2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // overflow: "hidden",
        marginBottom: "-100px",
      }}
    >
      {/* Dynamic Background Image */}
      {/* <Box
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
      /> */}

      <Box
        sx={{
          mt: { xs: 10, md: 10 },
          zIndex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!showForm ? (
          <>
            {/* Header */}
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                // marginTop: ,
                // left: "50%",
                // transform: "translateX(-50%)",
                fontWeight: "bold",
                color: "#8929e2",
                textAlign: "center",
                // zIndex: 2,
                marginTop: "50px",
        
              }}
            >
              Welcome to TalentLink
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: "#8929e2", mb: 4, textAlign: "center", zIndex: 1 }}
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
                  className="mt-0"
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
                    Login as {label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    {description}
                  </Typography>
                </Card>
              ))}
            </Box>
          </>
        ) : (
          /* Login Form */
          <Card
            sx={{
              p: 4,
              maxWidth: 500,
              width: "100%",
              background: "rgba(255,255,255,0.95)",
              borderRadius: 3,
              zIndex: 1,
              marginTop: "60px",
              // marginBottom: "110px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Button
                onClick={handleBackToRoles}
                sx={{ mr: 2, minWidth: "auto", p: 1 , color: "#8F2BDF"}}
              >
                ← Back
              </Button>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Login as {roles.find((r) => r.role === selectedRole)?.label}
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

            {/* Google Login Button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{
                mb: 3,
                py: 1.5,
                borderColor: "#8F2BDF",
                color: "#8F2BDF",
               
              }}
              startIcon={<GoogleIcon />}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                "Continue with Google"
              )}
            </Button>

            <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'center', display: 'block', mb: 2 }}>
              New to TalentLink? Google login will create your account automatically
            </Typography>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary">
                OR
              </Typography>
            </Divider>

            {/* Email Login Form */}
            <Box component="form" onSubmit={handleEmailLogin}>
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
                sx={{ mb: 3 }}
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
<div className="mb-5 text-right hover:underline hover:text-[#8F2BE0]">
             <Link to='/resetpassword'>Forgot Password ?</Link>
             </div>

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
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Box>
          </Card>
        )}

        <Typography
          variant="body1"
          sx={{ color: "#8E2ADF", mt: 3, zIndex: 1, textAlign: "center", marginBottom: "100px" }}
          className="!mb-[150px]"
        >
          New here?{" "}
          <a
            href="/signup"
            style={{ color: "#8E2ADF", textDecoration: "underline" }}
          >
            Sign up instead
          </a>
        </Typography>
      </Box>
    </Box>
  );
}
