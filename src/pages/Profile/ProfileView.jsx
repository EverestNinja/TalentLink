import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box, Card, Typography, Button, Avatar, Chip, Grid, Alert, LinearProgress, Paper,
} from '@mui/material';
import {
  Edit as EditIcon, Email as EmailIcon, School as SchoolIcon, Work as WorkIcon,
  Business as BusinessIcon, Language as WebsiteIcon, Link as LinkedInIcon,
  Folder as PortfolioIcon, LocationOn as LocationIcon, CalendarToday as CalendarIcon,
  Person as PersonIcon, Group as GroupIcon, Star as StarIcon,
} from '@mui/icons-material';
import { getProfileCompletionStatus } from '../Login/process';

// Profile section configurations
const PROFILE_SECTIONS = {
  user: [
    {
      title: 'Education & Skills',
      icon: <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />,
      fields: [
        { key: 'education', label: 'Education', type: 'text' },
        { key: 'skills', label: 'Skills', type: 'chips', color: 'primary' },
        { key: 'interests', label: 'Interests', type: 'chips', color: 'secondary' },
      ]
    },
    {
      title: 'Goals & Portfolio',
      icon: <StarIcon sx={{ mr: 1, color: 'warning.main' }} />,
      fields: [
        { key: 'lookingFor', label: 'Looking For', type: 'chips', color: 'info' },
        { key: 'portfolioURL', label: 'Portfolio', type: 'button', icon: <PortfolioIcon />, text: 'View Portfolio' },
      ]
    }
  ],
  mentor: [
    {
      title: 'Expertise & Experience',
      icon: <WorkIcon sx={{ mr: 1, color: 'success.main' }} />,
      fields: [
        { key: 'experience', label: 'Experience', type: 'text' },
        { key: 'expertise', label: 'Expertise Areas', type: 'chips', color: 'success' },
      ]
    },
    {
      title: 'Mentorship & Bio',
      icon: <GroupIcon sx={{ mr: 1, color: 'info.main' }} />,
      fields: [
        { key: 'bio', label: 'About', type: 'text' },
        { key: 'availableFor', label: 'Available For', type: 'chips', color: 'info' },
        { key: 'linkedinURL', label: 'LinkedIn Profile', type: 'button', icon: <LinkedInIcon />, text: 'LinkedIn Profile' },
      ]
    }
  ],
  organization: [
    {
      title: 'Company Information',
      icon: <BusinessIcon sx={{ mr: 1, color: 'warning.main' }} />,
      fields: [
        { key: 'companyName', label: 'Company Name', type: 'text' },
        { key: 'industry', label: 'Industry', type: 'text' },
        { key: 'location', label: 'Location', type: 'text', icon: <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> },
        { key: 'websiteURL', label: 'Visit Website', type: 'button', icon: <WebsiteIcon />, text: 'Visit Website' },
      ]
    },
    {
      title: 'Open Opportunities',
      icon: <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />,
      fields: [
        { key: 'openRoles', label: 'Open Roles', type: 'chips', color: 'primary' },
      ]
    }
  ]
};

// Reusable Field Component
const ProfileField = ({ field, value }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  switch (field.type) {
    case 'text':
      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {field.icon}{field.label}
          </Typography>
          <Typography variant="body1" color="text.secondary">{value}</Typography>
        </Box>
      );
    
    case 'chips':
      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {field.label}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {value.map((item, index) => (
              <Chip key={index} label={item} color={field.color} variant="outlined" size="small" />
            ))}
          </Box>
        </Box>
      );
    
    case 'button':
      return (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={field.icon}
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textTransform: 'none' }}
          >
            {field.text}
          </Button>
        </Box>
      );
    
    default:
      return null;
  }
};

// Reusable Section Component
const ProfileSection = ({ section, userData }) => (
  <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {section.icon}{section.title}
    </Typography>
    {section.fields.map((field) => (
      <ProfileField key={field.key} field={field} value={userData[field.key]} />
    ))}
  </Paper>
);

const ProfileView = React.memo(() => {
  const navigate = useNavigate();
  const { user, userData, isAuthenticated, loading, getDisplayName } = useAuth();
  const [completionStatus, setCompletionStatus] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userData && user) {
      const fetchCompletionStatus = async () => {
        try {
          const status = await getProfileCompletionStatus(user.uid);
      setCompletionStatus(status);
        } catch (error) {
          console.error('Error fetching completion status:', error);
        }
      };
      fetchCompletionStatus();
    }
  }, [loading, isAuthenticated, userData, user, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const renderRoleBadge = (role) => {
    const roleConfig = {
      user: { color: 'primary', icon: <PersonIcon />, label: 'User' },
      mentor: { color: 'success', icon: <SchoolIcon />, label: 'Mentor' },
      organization: { color: 'warning', icon: <BusinessIcon />, label: 'Organization' }
    };
    const config = roleConfig[role] || roleConfig.user;
    
    return (
      <Chip icon={config.icon} label={config.label} color={config.color} variant="filled" sx={{ fontWeight: 'bold' }} />
    );
  };

  const getQuickActions = () => {
    const baseActions = [
      { label: 'View Feed', path: '/feed' },
      { label: 'Browse Opportunities', path: '/jobs' }
    ];
    
    const roleActions = {
      user: [{ label: 'Find Mentors', path: '/mentors' }],
      mentor: [{ label: 'Find Mentees', path: '/mentees' }],
      organization: [{ label: 'Post Opportunity', path: '/post-opportunity' }]
    };
    
    return [...baseActions, ...(roleActions[userData?.role] || [])];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !userData) return null;

  const sections = PROFILE_SECTIONS[userData.role] || [];
  const displayName = getDisplayName();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Profile Header */}
        <Card sx={{ mb: 4, p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
            <Avatar
              src={user?.photoURL}
              sx={{ width: 120, height: 120, fontSize: '2rem', bgcolor: 'primary.main' }}
            >
              {(userData.displayName || userData.firstName || 'U').charAt(0)?.toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{displayName}</Typography>
                {renderRoleBadge(userData.role)}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <EmailIcon color="action" />
                <Typography variant="body1" color="text.secondary">{userData.email}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <CalendarIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  Member since {formatDate(userData.createdAt)}
                </Typography>
              </Box>

                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                onClick={() => navigate(`/profile/complete?edit=true&role=${userData.role}`)}
                  sx={{
                    background: 'linear-gradient(to right, #8928e2, #a133d7)',
                  '&:hover': { background: 'linear-gradient(to right, #7a1fd8, #9128ce)' },
                  }}
                >
                  Edit Profile
                </Button>
            </Box>
          </Box>

          {/* Profile Completion Status */}
          {completionStatus && !completionStatus.isComplete && (
            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Profile {completionStatus.completionPercentage}% Complete
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={completionStatus.completionPercentage} 
                  sx={{ mb: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2">
                  Complete your profile to unlock all features and get better matches!
                </Typography>
            </Alert>
          )}

          {completionStatus?.isComplete && (
            <Alert severity="success">
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>🎉 Profile Complete!</Typography>
              <Typography variant="body2">Your profile is 100% complete and ready to connect with others.</Typography>
            </Alert>
          )}
        </Card>

        {/* Role-Specific Content */}
        {sections.length > 0 ? (
          <Grid container spacing={3}>
            {sections.map((section, index) => (
              <Grid item xs={12} md={6} key={index}>
                <ProfileSection section={section} userData={userData} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Complete your profile to see more information here.
            </Typography>
          </Paper>
        )}

        {/* Quick Actions */}
        <Card sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Quick Actions</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {getQuickActions().map((action) => (
              <Button key={action.path} variant="outlined" onClick={() => navigate(action.path)}>
                {action.label}
              </Button>
            ))}
          </Box>
        </Card>
      </Box>
    </Box>
  );
});

export default ProfileView; 