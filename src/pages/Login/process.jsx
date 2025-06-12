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
      experience: '',
      bio: '',
      availability: '',
      linkedinURL: '',
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
      user,
      isNewUser: true
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
      user,
      isNewUser: true
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

// Get redirect path for signup (new users) vs login (existing users)
export const getRedirectPath = (role, userData, isNewUser = false) => {
  // For new signups, always go to profile complete page
  if (isNewUser) {
    return `/profile/complete?role=${role}`;
  }
  
  // For existing users, check if profile is complete
  if (userData && userData.profileComplete === false) {
    // If profile incomplete, redirect to complete it
    return `/profile/complete?role=${role}`;
  }
  
  // For users with complete profiles, redirect to feed (main app)
  return '/feed';
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
export const loginWithEmail = async (email, password, selectedRole) => {
  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user document from Firestore
    const userData = await getUserDocument(user.uid);
    
    if (!userData) {
      // Sign out the user since no account exists in our system
      await auth.signOut();
      throw new Error('No account found with this email. Please sign up first or use the correct login portal.');
    }
    
    // Validate role - check if user's role matches the selected login role
    if (userData.role !== selectedRole) {
      // Sign out the user since they logged in through wrong portal
      await auth.signOut();
      
      const roleNames = {
        user: 'User',
        mentor: 'Mentor', 
        organization: 'Organization'
      };
      
      throw new Error(`You are registered as a ${roleNames[userData.role]}. Please use the ${roleNames[userData.role]} login portal instead.`);
    }
    
    return {
      success: true,
      message: 'Login successful!',
      userData,
      user,
      isNewUser: false
    };
    
  } catch (error) {
    // Handle Firebase auth errors
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email address. Please sign up first or try Google login.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please check your password and try again.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address format');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('This account has been disabled. Please contact support.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed login attempts. Please wait a few minutes and try again.');
    } else if (error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password. Please check your credentials.');
    } else {
      throw new Error(error.message || 'Failed to login');
    }
  }
};

// Unified Google login/signup function
export const loginWithGoogle = async (selectedRole) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Get user document from Firestore
    const userData = await getUserDocument(user.uid);
    
    // If user doesn't exist, auto-create account (new user flow)
    if (!userData) {
      console.log('New Google user detected, creating account...');
      
      // Extract name from Google profile
      const displayName = user.displayName || '';
      const [firstName = '', lastName = ''] = displayName.split(' ');
      
      // Create user document for new user
      const newUserData = await createUserDocument(user, {
        firstName: firstName || 'User',
        lastName: lastName || '',
        role: selectedRole
      });
      
      return {
        success: true,
        message: 'Welcome to TalentLink! Please complete your profile to get started.',
        userData: newUserData,
        user,
        isNewUser: true
      };
    }
    
    // Existing user flow - validate role
    if (userData.role !== selectedRole) {
      // Sign out the user since they logged in through wrong portal
      await auth.signOut();
      
      const roleNames = {
        user: 'User',
        mentor: 'Mentor', 
        organization: 'Organization'
      };
      
      throw new Error(`You are registered as a ${roleNames[userData.role]}. Please use the ${roleNames[userData.role]} login portal instead.`);
    }
    
    // Existing user login successful
    return {
      success: true,
      message: 'Welcome back! Login successful.',
      userData,
      user,
      isNewUser: false
    };
    
  } catch (error) {
    // Handle specific Firebase errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Google login was cancelled');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked. Please allow popups and try again.');
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account with this email already exists. Please use email login or a different Google account.');
    } else {
      // If it's our custom error (wrong role), don't wrap it
      if (error.message.includes('registered as a')) {
        throw error;
      }
      throw new Error(error.message || 'Failed to continue with Google');
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
      mentor: ['expertise', 'experience', 'bio', 'availability', 'linkedinURL'],
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
      
      // Special validation for linkedinURL
      if (field === 'linkedinURL') {
        if (!value || typeof value !== 'string' || value.trim() === '') {
          missingFields.push(field);
        } else {
          // Basic URL validation for LinkedIn
          const urlPattern = /^https?:\/\/.+/i;
          const linkedinPattern = /linkedin\.com/i;
          if (urlPattern.test(value.trim()) && linkedinPattern.test(value.trim())) {
            completedFields.push(field);
          } else {
            missingFields.push(field);
          }
        }
      }
      // Standard validation for other fields
      else if (!value || 
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

 