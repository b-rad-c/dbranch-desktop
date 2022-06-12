import 'react-quill/dist/quill.snow.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'

import BrowsePage from './routes/browse';
import EditPage from './routes/edit';
import MainPage from './routes/main';
import SettingsPage from './routes/settings';

import { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Stack } from 'react-bootstrap'
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HashRouter, NavLink } from 'react-router-dom';
import { PencilSquare, HouseDoor, Gear, Newspaper } from 'react-bootstrap-icons'

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

  const paths = [
    ['/', 'Home', (<HouseDoor size={iconSize} />)],
    ['/browse', 'Browse', (<Newspaper size={iconSize} />)],
    ['/edit', 'Editor', (<PencilSquare size={iconSize} />)],
    ['/settings', 'Settings', (<Gear size={iconSize} />)],
  ]

  const route = paths.filter(path => path[0] === location.pathname)[0]
  const currentRouteLabel = route ? route[1] : ''

  return (

    <div>
      <Stack className='nav-drawer' direction='vertical'>
        {
          paths.map((path, index) => {
            return (
              <NavLink key={index} className='nav-link' to={path[0]}>
                <div className='nav-icon'>
                  {path[2]}<br />{path[1]}
                </div>
              </NavLink>
            )
          })
        }
      </Stack>

      <div className='header'><span className='header-content'>dBranch.news :: {currentRouteLabel}</span></div>

      <div className='app bg-light bg-gradient'>
        <Outlet/>
      </div>
      
    </div>
    
  );
}


const defaultSettings = {
  ipfsHost: 'http://127.0.0.1:5001',
  defaultNetworkHost: 'http://localhost:1323',
  draftFolder: '/Users/folder',
  dBranchPublishedDir: '/dBranch/published',
  dBranchCuratedDir: '/dBranch/curated',
  wireChannel: 'dbranch-wire'
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
        <Route path='browse' element={<BrowsePage settings={settings} />} />
        <Route path='edit' element={<EditPage settings={settings} />} />
        <Route path='settings' element={<SettingsPage settings={settings} updateSetting={updateSetting} resetSettings={resetSettings} />} />
        <Route
          path='*'
          element={
            <main style={{ padding: '1rem' }}>
              <p className='text-danger font-weight-bold'>Error: invalid route</p>
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