import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'
import { useState } from 'react';
import { render } from "react-dom";
import MainPage from "./routes/main";
import OtherPage from "./routes/other";
import Settings from "./routes/settings";
import Container from 'react-bootstrap/Container'


function App() {
  const [currentPage, setCurrentPage] = useState('main')
  const [showSettings, setShowSettings] = useState(false)
  const toggleSettings = () => setShowSettings(!showSettings)

  window.dBranch.showMainPage(() => setCurrentPage('main'))
  window.dBranch.showOtherPage(() => setCurrentPage('other'))
  window.dBranch.toggleSettings(() => toggleSettings())

  const show = (name) => { return !showSettings && name === currentPage }

  return (
    <Container fluid="md">
      {showSettings && <Settings toggleSettings={toggleSettings} />}
      {show('main') && <MainPage />}
      {show('other') && <OtherPage />}
    </Container>
  );
}

render(  
  <div className="app position-absolute top-0 start-0 bg-light bg-gradient">
    <App />
  </div>,
  document.getElementById("root")
);