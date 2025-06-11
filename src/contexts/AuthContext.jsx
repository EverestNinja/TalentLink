import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserDocument } from '../pages/Login/process';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          setUser(firebaseUser);
          setIsAuthenticated(true);
          
          // Fetch user data from Firestore
          try {
            const userDoc = await getUserDocument(firebaseUser.uid);
            setUserData(userDoc);
          } catch (error) {
            console.error('Error fetching user data:', error);
            // If user document doesn't exist, we still keep them authenticated
            // but without extended user data
            setUserData(null);
          }
        } else {
          // User is signed out
          setUser(null);
          setUserData(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setUserData(null);
      setIsAuthenticated(false);
      
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
  };

  const refreshUserData = async () => {
    if (user?.uid) {
      try {
        const userDoc = await getUserDocument(user.uid);
        setUserData(userDoc);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  // Helper functions - defined outside to have proper closure
  const getDisplayName = () => {
    // Priority: displayName > firstName+lastName > user.displayName > email
    if (userData?.displayName) {
      return userData.displayName;
    }
    if (userData?.firstName || userData?.lastName) {
      return `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
    }
    return user?.displayName || user?.email || 'User';
  };
  
  const getProfileImage = () => {
    const name = getDisplayName();
    return user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8928e2&color=fff`;
  };
  
  const getUserRole = () => {
    return userData?.role || 'user';
  };
  
  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const value = {
    user,
    userData,
    isAuthenticated,
    loading,
    logout,
    updateUserData,
    refreshUserData,
    getDisplayName,
    getProfileImage,
    getUserRole,
    getInitials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 