import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'
import MainPage from './routes/main';
import EditPage from './routes/edit';
import FilesPage from './routes/files';
import SettingsPage from './routes/settings';

import { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Stack } from 'react-bootstrap'
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HashRouter, NavLink } from 'react-router-dom';
import { PencilSquare, HouseDoor, Gear, Folder } from 'react-bootstrap-icons'

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

  return (
      
    <div>
      <Stack className='nav-drawer' direction='vertical'>
        <NavLink className='nav-link' to='/'>
          <div className='nav-icon'>
            <HouseDoor size={iconSize}/>
            <br />Home
          </div>
        </NavLink>
        <NavLink className='nav-link' to='/files'>
          <div className='nav-icon'>
            <Folder size={iconSize}/>
            <br />Files
          </div>
        </NavLink>
        <NavLink className='nav-link' to='/edit'>
          <div className='nav-icon'>
            <PencilSquare size={iconSize}/>
            <br />Edit
          </div>
        </NavLink>
        <NavLink className='nav-link' to='/settings'>
          <div className='nav-icon'>
            <Gear size={iconSize}/>
            <br />Settings
          </div>
        </NavLink>
      </Stack>
      <div className='app bg-light bg-gradient'>
        <Outlet/>
      </div>
      
    </div>
    
  );
}

const defaultSettings = {
  ipfsHost: 'http://127.0.0.1:5001'
}

function Root() {
const [ settings, setSettings ] = useState(defaultSettings)
const resetSettings = () => setSettings(defaultSettings)
const updateSetting = (prop, value) => {
    setSettings(prevState => {
        const updates = {}
        updates[prop] = value
        return {...prevState, ...updates}
    })
}

return (
<HashRouter>
  <Routes>
    <Route path='/' element={<App />}>
      <Route index element={<MainPage />} />
      <Route path='edit' element={<EditPage />} />
      <Route path='files' element={<FilesPage />} />
      <Route path='settings' element={<SettingsPage settings={settings} updateSetting={updateSetting} resetSettings={resetSettings} />} />
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