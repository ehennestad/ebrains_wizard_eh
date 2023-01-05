import Wizard from './components/Wizard';
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
    <PrivacyNotice />
    <div className="container container-form">
      <Wizard />
    </div>
    <footer className="app-footer footer">
      <div className="container container-footer">
        <p className="text-muted">Copyright © {new Date().getFullYear()} EBRAINS. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

export default App;
