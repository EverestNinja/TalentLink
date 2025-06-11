import React, { useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MentorIcon from "@mui/icons-material/School";
import OrgIcon from "@mui/icons-material/Business";

import normalBG from "../../assets/normal.svg";
import userBG from "../../assets/userbg.svg";
import mentorBG from "../../assets/mentor.svg";
import orgBG from "../../assets/org.svg";

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
  const [hoveredRole, setHoveredRole] = useState(null);

  const getBackgroundImage = () => {
    const role = roles.find((r) => r.role === hoveredRole);
    return role ? role.bg : normalBG;
  };

  const handleLogin = (role) => {
    console.log(`Login as ${role}`);
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

      {/* Headings */}
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
  Welcome to TalentLink
</Typography>

<Box sx={{ mt: { xs: 10, md: 25 }, zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
<Typography
  variant="body1"
  sx={{ color: "#f5f5f5", mb: 2, textAlign: "center", zIndex: 1 }}
>
  Choose your role to get started
</Typography>

  {/* Cards */}
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
              onClick={() => handleLogin(role)}
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
                Login as {label}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                {description}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>

      
      <Typography
  variant="body1"  sx={{ color: "#fff", mt: 3, zIndex: 1, textAlign: "center" }}
>
  New here?{" "}
  <a href="Signup" style={{ color: "#fff", textDecoration: "underline" }}>
    Sign up instead
  </a>
</Typography>
    </Box>
  );
}
