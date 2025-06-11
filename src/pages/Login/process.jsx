// Authentication and user management functions
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config'; // Adjust path as needed

// Form validation function
export const validateFormData = (formData) => {
  const { firstName, lastName, email, password, confirmPassword } = formData;
  
  if (!firstName.trim()) {
    throw new Error('First name is required');
  }
  
  if (!lastName.trim()) {
    throw new Error('Last name is required');
  }
  
  if (!email.trim()) {
    throw new Error('Email is required');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
};

// Create user document in Firestore
export const createUserDocument = async (user, userData) => {
  const userRef = doc(db, 'users', user.uid);
  
  const userDocument = {
    uid: user.uid,
    email: user.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    displayName: `${userData.firstName} ${userData.lastName}`,
    role: userData.role,
    createdAt: new Date().toISOString(),
    profileComplete: false,
    // Role-specific fields
    ...(userData.role === 'user' && {
      skills: [],
      interests: [],
      experience: '',
      education: '',
      resume: null,
      projects: []
    }),
    ...(userData.role === 'mentor' && {
      expertise: [],
      mentorshipAreas: [],
      experience: '',
      bio: '',
      availability: '',
      linkedin: '',
      mentees: []
    }),
    ...(userData.role === 'organization' && {
      organizationName: '',
      organizationType: '',
      website: '',
      description: '',
      location: '',
      size: '',
      projects: [],
      internships: []
    })
  };
  
  await setDoc(userRef, userDocument);
  return userDocument;
};

// Email signup function
export const signupWithEmail = async (formData, selectedRole) => {
  try {
    // Validate form data
    validateFormData(formData);
    
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      formData.email, 
      formData.password
    );
    
    const user = userCredential.user;
    
    // Update user profile
    await updateProfile(user, {
      displayName: `${formData.firstName} ${formData.lastName}`
    });
    
    // Create user document in Firestore
    const userData = await createUserDocument(user, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: selectedRole
    });
    
    return {
      success: true,
      message: 'Account created successfully! Welcome to TalentLink.',
      userData,
      user
    };
    
  } catch (error) {
    // Handle Firebase auth errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else {
      throw new Error(error.message || 'Failed to create account');
    }
  }
};

// Google signup function
export const signupWithGoogle = async (selectedRole) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user already exists
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      throw new Error('An account with this Google email already exists. Please login instead.');
    }
    
    // Extract name from Google profile
    const displayName = user.displayName || '';
    const [firstName = '', lastName = ''] = displayName.split(' ');
    
    // Create user document
    const userData = await createUserDocument(user, {
      firstName: firstName || 'User',
      lastName: lastName || '',
      role: selectedRole
    });
    
    return {
      success: true,
      message: 'Account created successfully with Google! Welcome to TalentLink.',
      userData,
      user
    };
    
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Google signup was cancelled');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked. Please allow popups and try again.');
    } else {
      throw new Error(error.message || 'Failed to sign up with Google');
    }
  }
};

// Get redirect path based on role and profile completion
export const getRedirectPath = (role, userData) => {
  // If profile is not complete, redirect to profile setup
  if (!userData.profileComplete) {
    switch (role) {
      case 'user':
        return '/profile/user-setup';
      case 'mentor':
        return '/profile/mentor-setup';
      case 'organization':
        return '/profile/org-setup';
      default:
        return '/profile/setup';
    }
  }
  
  // If profile is complete, redirect to role-specific dashboard
  switch (role) {
    case 'user':
      return '/dashboard/user';
    case 'mentor':
      return '/dashboard/mentor';
    case 'organization':
      return '/dashboard/organization';
    default:
      return '/dashboard';
  }
};

// Get user document from Firestore
export const getUserDocument = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user document:', error);
    throw new Error('Failed to fetch user data');
  }
};

// Email login function
export const loginWithEmail = async (email, password) => {
  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user document from Firestore
    const userData = await getUserDocument(user.uid);
    
    if (!userData) {
      throw new Error('User data not found. Please contact support.');
    }
    
    return {
      success: true,
      message: 'Login successful!',
      userData,
      user
    };
    
  } catch (error) {
    // Handle Firebase auth errors
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email address');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('This account has been disabled');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed login attempts. Please try again later.');
    } else {
      throw new Error(error.message || 'Failed to login');
    }
  }
};

// Google login function
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Get user document from Firestore
    const userData = await getUserDocument(user.uid);
    
    if (!userData) {
      throw new Error('Account not found. Please sign up first.');
    }
    
    return {
      success: true,
      message: 'Login successful with Google!',
      userData,
      user
    };
    
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Google login was cancelled');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked. Please allow popups and try again.');
    } else {
      throw new Error(error.message || 'Failed to login with Google');
    }
  }
};

// Get profile completion status
export const getProfileCompletionStatus = async (uid) => {
  try {
    const userData = await getUserDocument(uid);
    
    if (!userData) {
      return {
        isComplete: false,
        completionPercentage: 0,
        missingFields: ['All profile data missing'],
        nextStep: 'Complete basic profile information'
      };
    }
    
    const requiredFields = {
      basic: ['firstName', 'lastName', 'email'],
      user: ['skills', 'interests', 'experience', 'education'],
      mentor: ['expertise', 'mentorshipAreas', 'experience', 'bio', 'availability'],
      organization: ['organizationName', 'organizationType', 'website', 'description', 'location']
    };
    
    const roleSpecificFields = requiredFields[userData.role] || [];
    const allRequiredFields = [...requiredFields.basic, ...roleSpecificFields];
    
    const missingFields = [];
    const completedFields = [];
    
    // Check basic fields
    requiredFields.basic.forEach(field => {
      if (!userData[field] || (typeof userData[field] === 'string' && userData[field].trim() === '')) {
        missingFields.push(field);
      } else {
        completedFields.push(field);
      }
    });
    
    // Check role-specific fields
    roleSpecificFields.forEach(field => {
      const value = userData[field];
      if (!value || 
          (typeof value === 'string' && value.trim() === '') ||
          (Array.isArray(value) && value.length === 0)) {
        missingFields.push(field);
      } else {
        completedFields.push(field);
      }
    });
    
    const completionPercentage = Math.round((completedFields.length / allRequiredFields.length) * 100);
    const isComplete = missingFields.length === 0;
    
    // Determine next step based on missing fields
    let nextStep = 'Profile complete!';
    if (!isComplete) {
      if (missingFields.includes('firstName') || missingFields.includes('lastName')) {
        nextStep = 'Complete basic information';
      } else if (userData.role === 'user' && missingFields.some(field => ['skills', 'interests'].includes(field))) {
        nextStep = 'Add your skills and interests';
      } else if (userData.role === 'mentor' && missingFields.some(field => ['expertise', 'bio'].includes(field))) {
        nextStep = 'Complete mentor profile';
      } else if (userData.role === 'organization' && missingFields.some(field => ['organizationName', 'organizationType'].includes(field))) {
        nextStep = 'Complete organization details';
      } else {
        nextStep = `Complete remaining fields: ${missingFields.slice(0, 3).join(', ')}`;
      }
    }
    
    return {
      isComplete,
      completionPercentage,
      missingFields,
      completedFields,
      nextStep,
      userData
    };
    
  } catch (error) {
    console.error('Error checking profile completion:', error);
    throw new Error('Failed to check profile completion status');
  }
};

// Update profile completion status
export const updateProfileCompletionStatus = async (uid) => {
  try {
    const status = await getProfileCompletionStatus(uid);
    
    // Update the profileComplete field in Firestore
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      profileComplete: status.isComplete,
      profileCompletionPercentage: status.completionPercentage,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    
    return status;
  } catch (error) {
    console.error('Error updating profile completion status:', error);
    throw new Error('Failed to update profile completion status');
  }
};

// Update user profile
export const updateUserProfile = async (uid, profileData) => {
  try {
    const userRef = doc(db, 'users', uid);
    
    // Prepare the update data
    const updateData = {
      ...profileData,
      lastUpdated: new Date().toISOString()
    };
    
    // Update the user document in Firestore
    await setDoc(userRef, updateData, { merge: true });
    
    // Get the updated user data
    const updatedUserData = await getUserDocument(uid);
    
    // Update profile completion status
    const completionStatus = await updateProfileCompletionStatus(uid);
    
    return {
      success: true,
      message: 'Profile updated successfully!',
      userData: updatedUserData,
      completionStatus
    };
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }
};

// Update specific profile fields
export const updateProfileField = async (uid, fieldName, fieldValue) => {
  try {
    const userRef = doc(db, 'users', uid);
    
    const updateData = {
      [fieldName]: fieldValue,
      lastUpdated: new Date().toISOString()
    };
    
    await setDoc(userRef, updateData, { merge: true });
    
    // Update completion status after field update
    await updateProfileCompletionStatus(uid);
    
    return {
      success: true,
      message: `${fieldName} updated successfully!`
    };
    
  } catch (error) {
    console.error(`Error updating ${fieldName}:`, error);
    throw new Error(`Failed to update ${fieldName}`);
  }
};

// Additional utility functions
export const checkEmailExists = async (email) => {
  // This would typically check your user database
  // For now, we'll rely on Firebase Auth error handling
  return false;
};

export const generateUsername = (firstName, lastName) => {
  const base = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
  const random = Math.floor(Math.random() * 1000);
  return `${base}${random}`;
}; 