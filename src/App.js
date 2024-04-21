import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Wizard from './modules/Wizard/Main';
import Tracker from './modules/Tracker/Main';

import PrivacyBanner from './components/PrivacyBanner';
import DropdownMenu from './components/DropdownMenu';
import LoginToggleButton from './components/LoginToggleButton.js';
import Spinner from './components/Spinner.js';

import AppHeader from './components/AppHeader.js';
import AppFooter from './components/AppFooter.js';

import { UserProvider, UserContext } from './contexts/UserContext';

import './App.css';


const App = () => {

  // This is a workaround to force the Wizard component to re-render 
  // when the user selects a new action from the dropdown menu: Someone who
  // knows React should fix this.
  const [selectedAction, setSelectedAction] = useState(undefined);
  const [updateKey, setUpdateKey] = useState(Date.now());

  function handleMenuSelection(selectedOption) {
    if (!!selectedOption) {
      setSelectedAction(selectedOption);
      setUpdateKey(Date.now());
    }
  }

  return(
    <div className="App">
      <AppHeader />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/tracker" element={
              <div className="container container-form">
                <Tracker /> 
              </div> 
            } />
            <Route path="/" element={ 
              <div>
                <div className="container-subheader">
                  <div className="container-content-subheader ">
                    <div className="privacy-notice">
                      <PrivacyBanner />
                    </div>
                    <div className="subheader-menu">
                      <DropdownMenu handleMenuSelection={handleMenuSelection}/>
                    </div>
                    <div className="subheader-login">
                      <LoginToggleButton/>
                    </div>
                  </div>
                </div>
                <div style={{marginTop:"20px", marginBottom:"20px"}}>
                </div>
                <div className="container container-form">
                  <UserContext.Consumer>
                    {({ isAuthenticating, user }) => (
                      isAuthenticating ? <Spinner/> : <Wizard user={user} action={selectedAction} updateKey={updateKey}/>)}
                  </UserContext.Consumer>
                </div>
              </div>
              } />
          </Routes>
        </BrowserRouter>
      </UserProvider>
      <AppFooter />
    </div>
  )
};

export default App;
