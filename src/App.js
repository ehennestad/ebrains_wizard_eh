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
            }
            />
        
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
      <div className="container container-footer">
        <p className="text-muted">Copyright © {new Date().getFullYear()} EBRAINS. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

export default App;
