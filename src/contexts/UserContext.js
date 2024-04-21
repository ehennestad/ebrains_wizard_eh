import React, { createContext, useState, useContext, useRef } from 'react';

import authenticate from "../authentication/authenticate"; 
import getUser from '../authentication/GetUserInfo'
import getToken from '../authentication/authenticationUtilities'


// Create a new context
const UserContext = createContext();

// Create a provider for that context
const UserProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Loading...")
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  
  const tokenRef = useRef('');
  const hasAuthenticatedRef = useRef(false);

  if ( urlContainsAuthenticationParameters() ) {
    // Update the reference value if url contains authentication parameters
    // This is necessary to avoid re-authentication when the component re-renders
    hasAuthenticatedRef.current = true
  }

  function handleTokenReceived(token) {
    ///window.history.pushState({}, document.title, "/") // clear url 
    //setToken(token)
    tokenRef.current = token

    // clean the url for OIDC parameters
    const url = new URL(window.location.href);

    // Remove three specific parameters
    url.searchParams.delete('code');
    url.searchParams.delete('iss');
    url.searchParams.delete('session_state');

    // Replace the current URL without the three parameters
    window.history.replaceState({}, document.title, url.toString());

    setMessage("Retrieving user info...")
    return token
  }

  function handleUserReceived(user) {
    setUser(user)
    setIsAuthenticating(false)
  }

  function handleLoginError() {
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    window.history.replaceState({}, document.title, url.toString());
  }

  React.useEffect(() => {
    if (!hasAuthenticatedRef.current) {
      setMessage("Redirecting to EBRAINS IAM...")
      authenticate()

    } else {
      if (window.location.href.includes('error=')) {
        setIsAuthenticating(false)
        handleLoginError()

      } else if (window.location.href.includes('code=')) {
        setMessage("Authenticating...")
        getToken()
          .then( (token) => handleTokenReceived(token) )
            .then( (token) => getUser(token) )
              .then( (user) => handleUserReceived(user) )
      } else {
        setIsAuthenticating(false)
      }
    }
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        tokenRef,
        message,
        isAuthenticating,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


// Custom hook to use the UserContext
const useUserContext = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return userContext;
};

export { UserContext, UserProvider, useUserContext };


// Utility functions
function urlContainsAuthenticationParameters() {
  const URL = window.location.href
  return (URL.includes('error=') || URL.includes('code='))
}