import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Wizard from './components/Wizard';
import Console from './components/Console';

import PrivacyNotice from './components/PrivacyNotice';

import './App.css';

const App = () => (
  <div className="App">
    
    <header className="app-header">
      <div className="container container-header">
        <img src="EBRAINS-Curation-Services.png" alt="EBRAINS Curation Services Logo" width="100%" style={{"margin":"10px","display":"block","marginLeft":"auto","marginRight":"auto"}} />
      </div>
    </header>
    <div className="gradient"></div>

    <BrowserRouter>
      <Routes>
        <Route path="/console" element={
          <div className="container container-form">
            <Console /> 
          </div> 
        } />
        
        <Route path="/" element={ 
          <div>
            <PrivacyNotice />
            <div className="container container-form">
              <Wizard />
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
);

export default App;
