import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
          // User is signed in - set immediately to reduce loading time
          setUser(firebaseUser);
          setIsAuthenticated(true);
          setLoading(false); // Set loading to false immediately for faster navbar
          
          // Fetch user data in background (don't block UI)
          try {
            // Add timeout to prevent hanging on slow connections
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('getUserDocument timeout')), 5000)
            );
            
            const userDocPromise = getUserDocument(firebaseUser.uid);
            const userDoc = await Promise.race([userDocPromise, timeoutPromise]);
            
            setUserData(userDoc);
          } catch (error) {
            console.warn('Error fetching user data (non-blocking):', error);
            // Still keep user authenticated even if userData fails
            setUserData(null);
          }
        } else {
          // User is signed out
          setUser(null);
          setUserData(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setLoading(false); // Always set loading to false even on error
      }
    });

    return unsubscribe;
  }, []);

  // Memoized logout function
  const logout = useCallback(async () => {
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
  }, []);

  // Memoized update function
  const updateUserData = useCallback((newUserData) => {
    setUserData(newUserData);
  }, []);

  // Memoized refresh function with timeout
  const refreshUserData = useCallback(async () => {
    if (user?.uid) {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('refreshUserData timeout')), 3000)
        );
        
        const userDocPromise = getUserDocument(user.uid);
        const userDoc = await Promise.race([userDocPromise, timeoutPromise]);
        
        setUserData(userDoc);
      } catch (error) {
        console.warn('Error refreshing user data:', error);
      }
    }
  }, [user?.uid]);

  // Memoized helper functions to prevent recreation on every render
  const getDisplayName = useCallback(() => {
    // Priority: displayName > firstName+lastName > user.displayName > email
    if (userData?.displayName) {
      return userData.displayName;
    }
    if (userData?.firstName || userData?.lastName) {
      return `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
    }
    return user?.displayName || user?.email || 'User';
  }, [userData?.displayName, userData?.firstName, userData?.lastName, user?.displayName, user?.email]);
  
  const getProfileImage = useCallback(() => {
    const name = getDisplayName();
    return user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8928e2&color=fff`;
  }, [getDisplayName, user?.photoURL]);
  
  const getUserRole = useCallback(() => {
    return userData?.role || 'user';
  }, [userData?.role]);
  
  const getInitials = useCallback(() => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }, [getDisplayName]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
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
  }), [
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
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 