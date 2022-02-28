import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'
import MainPage from './routes/main';
import EditPage from './routes/edit';
import SettingsPage from './routes/settings';

import { useEffect } from 'react';
import { render } from 'react-dom';
import { Container, Stack } from 'react-bootstrap'
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HashRouter, NavLink } from 'react-router-dom';

import { PencilSquare, HouseDoor, Gear } from 'react-bootstrap-icons'

function App() {
  let navigate = useNavigate();
  let location = useLocation();
  useEffect(() => {
    window.dBranch.handleNavigateTo((_, value) => {
      console.log('from "' + location.pathname + '" to "' + value + '"')
      navigate(value, {state: {returnTo: location.pathname}})
    })
  })

  const iconSize = 42
  const linkClass = 'navLink border-bottom border-dark'

  return (
      
    <Container fluid='md'>
      <Stack className='nav-drawer border border-dark' direction='vertical'>
        <NavLink className={linkClass} to='/'>
            <div style={{height: '100%', width: '100%'}}>
              <HouseDoor size={iconSize}/>
              <br />Home
            </div>
            
        </NavLink>
        <NavLink className={linkClass} to='/edit'>
          <PencilSquare size={iconSize}/>
          <br />Edit
        </NavLink>
        <NavLink className={linkClass} to='/settings'>
          <Gear size={iconSize}/>
          <br />Settings
        </NavLink>
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
        <Route path='/' element={<App />}>
          <Route index element={<MainPage />} />
          <Route path='edit' element={<EditPage />} />
          <Route path='settings' element={<SettingsPage />} />
          <Route
            path='*'
            element={
              <main style={{ padding: '1rem' }}>
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
  document.getElementById('root')
);