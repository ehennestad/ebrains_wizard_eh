import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spin } from 'antd'
import ConfigProvider from './components/ConfigProvider';


import Wizard from './modules/Wizard/Main';
import Tracker from './modules/Tracker/Main';

import PrivacyBanner from './components/PrivacyBanner';
import DropdownMenu from './components/DropdownMenu';
import LoginToggleButton from './components/LoginToggleButton.js';

import authenticate, {login, logout} from "./authentication/authenticate"; 
import getUser from './authentication/GetUserInfo'
import getToken from './authentication/authenticationUtilities'


import './App.css';


const Loading = ({message}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <ConfigProvider componentSize={"large"}>
        <Spin size='large' style={{marginBottom:'6rem'}}>
          <h1  style={{marginTop:'10rem'}}>{message ? message : 'Please wait...'}</h1>
          <div className="content" />
        </Spin>
      </ConfigProvider>
   </div>
  )
}

const App = () => {

  // This is a workaround to force the Wizard component to re-render 
  // when the user selects a new action from the dropdown menu: Someone who
  // knows React should fix this.
  const [selectedAction, setSelectedAction] = useState(undefined);
  const [updateKey, setUpdateKey] = useState(Date.now());

  const [loading, setLoading] = React.useState(true)
  const [token, setToken] = React.useState(null)
  const [user, setUser] = React.useState(null)
  const [message, setMessage] = React.useState("Loading...")


  function handleMenuSelection(selectedOption) {
    if (!!selectedOption) {
      setSelectedAction(selectedOption);
      setUpdateKey(Date.now());
    }
  }

  function handleTokenReceived(token) {
    ///window.history.pushState({}, document.title, "/") // clear url 
    setToken(token)
    setMessage("Retrieving user info...")
    return token
  }

  function handleUserReceived(user) {
    setUser(user)
    setLoading(false)
  }

  React.useEffect(() => {
    // console.log('useEffect')
    // only authenticate if we are not already authenticated
    if (!window.location.href.includes('code=') && !window.location.href.includes('error=')) {
      setMessage("Loading...")
      authenticate()
    } else if (window.location.href.includes('error=')) {
      setLoading(false)
    } else {
      setMessage("Authenticating...")
      getToken()
      .then( (token) => handleTokenReceived(token) )
        .then( (token) => getUser(token) )
          .then( (user) => handleUserReceived(user) )
    }
  }, [])


  // if (loading) {
  //   return ( 
  //     <Loading/>
  //   )
  // } else {
    return(
      <div className="App">
        
        <header className="app-header">
          <div className="container container-header">
            <a href="/"><img src="EBRAINS-Curation-Services.png" alt="EBRAINS Curation Services Logo" width="100%" style={{"margin":"10px","display":"block","marginLeft":"auto","marginRight":"auto"}} /></a>
          </div>
        </header>
        <div className="container-gradient"></div>

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
                      <LoginToggleButton loading={loading} user={user} login={login} logout={logout}/>
                    </div>
                  </div>
                </div>
                <div style={{marginTop:"20px", marginBottom:"20px"}}>
                </div>
                <div className="container container-form">
                  {loading ? <Loading message={message}/> : <Wizard user={user} action={selectedAction} updateKey={updateKey}/>}
                </div>
              </div>
              } />
          </Routes>
        </BrowserRouter>

        <footer className="app-footer footer">
          <div className="container-footer">
            <div className="pull-left">
              <p className="text-muted">Copyright © {new Date().getFullYear()} EBRAINS. All rights reserved.</p>
            </div>
            <div className="pull-right">
              <p className="text-muted"> 
                <a href="https://github.com/HumanBrainProject/ebrains_wizard/issues/new" target="_blank" rel="noreferrer">Report issue (Github)</a> 
                &nbsp;|&nbsp;
                <a href="mailto:curation-support@ebrains.eu?subject=Metadata Wizard Issue : <Enter short description here>&body=Dear Curation Team,%0D%0A%0D%0A%0D%0A">Report issue (Email)</a> 
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  };
// }

export default App;
