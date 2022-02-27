import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'
import { useEffect } from 'react';
import { render } from "react-dom";
import Main from "./routes/main";
import Settings from "./routes/settings";
import Container from 'react-bootstrap/Container'
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history"


function App() {
  let navigate = useNavigate();
  useEffect(() => {
    window.electronAPI.handleOpenTab((_, value) => {
      navigate('/' + value)
    })
  })

  return (
    <Container fluid="md">
      <Outlet />
    </Container>
  );
}

const history = createBrowserHistory({ window });

render(  
  <div className="app position-absolute top-0 start-0 bg-light bg-gradient">
    <HistoryRouter history={history}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Main />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>Page not found!</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </HistoryRouter>
  </div>,
  document.getElementById("root")
);