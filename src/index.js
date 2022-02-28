import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'
import MainPage from "./routes/main";
import EditPage from "./routes/edit";
import SettingsPage from "./routes/settings";

import { useEffect } from 'react';
import { render } from "react-dom";
import { Container, Stack } from 'react-bootstrap'
import { Routes, Route, Outlet, useNavigate, useLocation } from "react-router-dom";
import { HashRouter, NavLink } from "react-router-dom";


function App() {
  let navigate = useNavigate();
  let location = useLocation();
  useEffect(() => {
    window.dBranch.handleNavigateTo((_, value) => {
      console.log('from "' + location.pathname + '" to "' + value + '"')
      navigate(value, {state: {returnTo: location.pathname}})
    })
  })

  return (
      
    <Container fluid="md">
      <Stack className="nav-drawer" direction="vertical">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/edit">Edit</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </Stack>
      <div className='app bg-light bg-gradient'>
        <Outlet/>
      </div>
      
    </Container>
    
  );
}

function Root() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<MainPage />} />
          <Route path="edit" element={<EditPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>Error: invalid route</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  )
}

render(  
  <div>
    <Root />
  </div>,
  document.getElementById("root")
);