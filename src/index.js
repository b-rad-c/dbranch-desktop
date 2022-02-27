import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import Branches from "./routes/Branches";
import Info from "./routes/Info";

const rootElement = document.getElementById("root");
render(
  <div className="app position-absolute top-0 start-0 bg-light bg-gradient">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="branches" element={<Branches />} />
          <Route path="info" element={<Info />} />
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

    </BrowserRouter>
  </div>,
  rootElement
);