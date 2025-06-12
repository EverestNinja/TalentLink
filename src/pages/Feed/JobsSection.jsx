import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { MdLocationOn } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import JobDetailsModal from "../Jobs/components/JobDetailsModal";
import { getJobPostings } from "../../firebase/jobService";

function JobsSection() {
  const [jobsData, setJobsData] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Handle job click - open job details modal
  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  // Handle apply click
  const handleApplyClick = (e, job) => {
    e.stopPropagation(); // Prevent triggering job click
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  // Handle modal close
  const handleJobModalClose = () => {
    setIsJobModalOpen(false);
    setSelectedJob(null);
  };

  // Navigate to full jobs page
  const handleViewAllJobs = () => {
    navigate('/jobs');
  };

  // Fetch latest jobs from Firebase
  useEffect(() => {
    const loadLatestJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);
        
        const result = await getJobPostings({ limit: 10 });
        
        if (result.success) {
          // Transform Firebase data to match the existing UI format
          const transformedJobs = result.jobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            salary: job.salary || "Salary not specified",
            location: job.location,
            type: job.workMode || job.type,
            date: new Date(job.createdAt).toLocaleDateString() || "Recently posted",
            description: job.description,
            requirements: job.requirements,
            applicationEmail: job.applicationEmail,
            applicationUrl: job.applicationUrl,
            deadline: job.deadline,
            createdAt: job.createdAt,
          }));
          
          setJobsData(transformedJobs);
        } else {
          setJobsError(result.error || 'Failed to load latest jobs');
          setJobsData([]);
        }
      } catch (error) {
        setJobsError(error.message);
        setJobsData([]);
      } finally {
        setJobsLoading(false);
      }
    };

    loadLatestJobs();
  }, []);

  // Render jobs section with loading and error states
  const renderJobsContent = () => {
    if (jobsLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress size={40} />
        </Box>
      );
    }

    if (jobsError) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Failed to load latest jobs: {jobsError}
          </Typography>
          <Button 
            size="small" 
            onClick={() => window.location.reload()}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </Alert>
      );
    }

    if (jobsData.length === 0) {
      return (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No jobs available at the moment.
          </Typography>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={handleViewAllJobs}
          >
            Browse All Jobs
          </Button>
        </Paper>
      );
    }

    return (
      <>
        {jobsData.map((job) => (
          <Paper 
            key={job.id} 
            variant="outlined" 
            sx={{ 
              p: 2, 
              mb: 2, 
              cursor: 'pointer', 
              '&:hover': { 
                bgcolor: 'grey.50',
                boxShadow: 2
              },
              transition: 'all 0.2s ease'
            }}
            onClick={() => handleJobClick(job)}
          >
            <Typography color="primary" fontWeight="bold" sx={{ mb: 1 }}>
              {job.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              {job.company}
            </Typography>
            
            <Box display="flex" alignItems="center" color="text.secondary" sx={{ mb: 0.5 }}>
              <MdLocationOn size={14} />
              <Typography variant="caption" ml={1}>
                {job.location}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" color="text.secondary" sx={{ mb: 1 }}>
              <RiMoneyRupeeCircleLine size={14} />
              <Typography variant="caption" ml={1}>
                {job.salary}
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.disabled">
                {job.date}
              </Typography>
              
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={(e) => handleApplyClick(e, job)}
                sx={{ 
                  py: 0.5,
                  px: 1.5,
                  fontSize: '0.7rem',
                  textTransform: 'none'
                }}
              >
                {isAuthenticated ? 'Apply' : 'Login to Apply'}
              </Button>
            </Box>
            
            {job.deadline && (
              <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 0.5 }}>
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </Typography>
            )}
          </Paper>
        ))}
        
        {/* View All Jobs Button */}
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={handleViewAllJobs}
          sx={{ mt: 2 }}
        >
          View All Jobs
        </Button>
      </>
    );
  };

  return (
    <>
      <Box width="25%" bgcolor="white" p={2} overflow="auto" borderRadius={2} height="100%" boxShadow={2}>
        <Typography variant="h6" color="#8929e2" gutterBottom>
          Latest Jobs
          {!jobsLoading && jobsData.length > 0 && (
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              ({jobsData.length})
            </Typography>
          )}
        </Typography>
        {renderJobsContent()}
      </Box>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={handleJobModalClose}
      />
    </>
  );
}

export default JobsSection;