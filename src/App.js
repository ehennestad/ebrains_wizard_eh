import Wizard from './components/Wizard';
import './App.css';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src="EBRAINS-Curation-Services.png" alt="EBRAINS Curation Services Logo" height="120" style={{"margin":"10px","display":"block","marginLeft":"auto","marginRight":"auto"}} />
    </header>
    <div className="gradient"></div>
    <div className="container form">
      <Wizard />
    </div>
    <footer className="footer app-footer">
      <div className="container footer-container">
        <p className="text-muted">Copyright © {new Date().getFullYear()} EBRAINS. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

export default App;