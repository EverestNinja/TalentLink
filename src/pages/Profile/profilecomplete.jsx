import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { updateUserProfile } from '../Login/process';

// Field configurations for each role
const ROLE_FIELDS = {
  user: [
    { name: 'skills', label: 'Skills', type: 'array', placeholder: 'e.g., React, Python, Figma' },
    { name: 'interests', label: 'Interests', type: 'array', placeholder: 'e.g., AI, Web Dev, Design' },
    { name: 'education', label: 'Education', type: 'text', placeholder: 'School/University name' },
    { name: 'portfolioURL', label: 'Portfolio URL', type: 'url', placeholder: 'Link to your portfolio or resume', optional: true },
    { name: 'lookingFor', label: 'Looking For', type: 'array', placeholder: 'e.g., internships, mentors' },
  ],
  mentor: [
    { name: 'expertise', label: 'Expertise', type: 'array', placeholder: 'e.g., AI, Leadership, Python' },
    { name: 'experience', label: 'Experience', type: 'text', placeholder: 'e.g., 5+ years in industry' },
    { name: 'availableFor', label: 'Available For', type: 'array', placeholder: 'e.g., 1:1 mentorship, talks' },
    { name: 'bio', label: 'Bio', type: 'multiline', placeholder: 'Short bio or description' },
    { name: 'linkedinURL', label: 'LinkedIn URL', type: 'url', placeholder: 'Your LinkedIn profile URL', optional: true },
  ],
  organization: [
    { name: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Your organization name' },
    { name: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g., Tech, Education, Design' },
    { name: 'openRoles', label: 'Open Roles', type: 'array', placeholder: 'e.g., Frontend Intern, UI Mentor' },
    { name: 'websiteURL', label: 'Website URL', type: 'url', placeholder: 'Your company website', optional: true },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'City or remote' },
  ],
};

// Reusable Form Field Component
const FormField = ({ field, value, onChange, sx = { mb: 2 } }) => {
  const [inputValue, setInputValue] = React.useState('');

  // Initialize input value when value prop changes
  React.useEffect(() => {
    if (field.type === 'array') {
      // Handle both array and string values safely
      if (Array.isArray(value)) {
        setInputValue(value.join(', '));
      } else if (typeof value === 'string') {
        setInputValue(value);
      } else {
        setInputValue('');
      }
    } else {
      setInputValue(value || '');
    }
  }, [value, field.type]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (field.type === 'array') {
      // For array fields, store the raw string and process on blur
      onChange(field.name, newValue);
    } else {
      onChange(field.name, newValue);
    }
  };

  const handleBlur = () => {
    if (field.type === 'array' && typeof inputValue === 'string') {
      // Process the comma-separated string into an array when user stops typing
      const items = inputValue.split(',').map(item => item.trim()).filter(item => item);
      onChange(field.name, items);
    }
  };

  return (
    <TextField
      fullWidth
      label={`${field.label}${field.optional ? ' (optional)' : ''}`}
      placeholder={field.placeholder}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      multiline={field.type === 'multiline'}
      rows={field.type === 'multiline' ? 3 : 1}
      type={field.type === 'url' ? 'url' : 'text'}
      sx={sx}
    />
  );
};

const ProfileComplete = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userData, updateUserData, refreshUserData, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState({});

  const role = searchParams.get('role') || userData?.role;
  const fields = ROLE_FIELDS[role] || [];
  const isEditing = searchParams.get('edit') === 'true' || userData?.profileComplete;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // Initialize profile data
    if (role && userData) {
      const displayName = userData?.displayName || `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || '';
      const initialData = { name: displayName };
      
      // Add existing data for each field
      fields.forEach(field => {
        initialData[field.name] = userData[field.name] || (field.type === 'array' ? [] : '');
      });
      
      setProfileData(initialData);
    }
  }, [authLoading, isAuthenticated, userData, role, navigate, fields]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare profile data with proper name handling and array processing
      const submitData = { ...profileData };
      
      // Handle name field
      if (profileData.name) {
        const nameParts = profileData.name.trim().split(' ');
        submitData.firstName = nameParts[0] || '';
        submitData.lastName = nameParts.slice(1).join(' ') || '';
        submitData.displayName = profileData.name;
        delete submitData.name;
      }

      // Process any array fields that might still be strings
      fields.forEach(field => {
        if (field.type === 'array') {
          if (typeof submitData[field.name] === 'string') {
            // Convert comma-separated string to array
            submitData[field.name] = submitData[field.name]
              .split(',')
              .map(item => item.trim())
              .filter(item => item);
          } else if (!Array.isArray(submitData[field.name])) {
            // Ensure it's an array, fallback to empty array
            submitData[field.name] = [];
          }
        }
      });

      const updatedData = await updateUserProfile(user.uid, submitData);
      updateUserData(updatedData.userData);
      
      // Refresh AuthContext to ensure consistent data across components
      await refreshUserData();
      
      setSuccess(isEditing ? 'Profile updated successfully!' : 'Profile completed successfully!');
      
      setTimeout(() => navigate(isEditing ? '/profile' : '/'), 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        // background: 'linear-gradient(to right, #b263fc, #8928e2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        marginTop: "100px",
        marginBottom: "20px"
      }}
    >
      <Card sx={{ p: 4, maxWidth: 600, width: '100%', borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
          {isEditing ? 'Edit Your Profile' : 'Complete Your Profile'}
        </Typography>

        <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
          {isEditing 
            ? `Update your ${role} profile information` 
            : `Help others discover you by completing your ${role} profile`
          }
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            value={profileData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          {fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={profileData[field.name]}
              onChange={handleInputChange}
            />
          ))}

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button 
              onClick={() => navigate(isEditing ? '/profile' : '/')} 
              variant="outlined" 
              sx={{ flex: 1 }}
            >
              {isEditing ? 'Cancel' : 'Skip for Now'}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                flex: 1,
                background: 'linear-gradient(to right, #8928e2, #a133d7)',
                '&:hover': { background: 'linear-gradient(to right, #7a1fd8, #9128ce)' },
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : (isEditing ? 'Update Profile' : 'Complete Profile')}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ProfileComplete; 