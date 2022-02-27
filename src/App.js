import { Outlet, NavLink } from "react-router-dom";
import Stack from 'react-bootstrap/Stack'
import Container from 'react-bootstrap/Container'

export default function App() {
  return (
    <Container fluid="md">
      <div className="bubble" style={{marginTop: '1rem'}}>
        <h1 className="title">dBranch.news</h1>
        <h1 className="subtitle">a decentralized marketplace for journalism</h1>

        <Stack className="justify-content-center" direction="horizontal" gap={3} >
          <NavLink exact="true" className="navLink" to="/">Home</NavLink>
            <span className="navLink">::</span>
          <NavLink exact="true" className="navLink" to="/branches">Branches</NavLink>
            <span className="navLink">::</span>
          <NavLink className="navLink" to="/info">Info</NavLink>
        </Stack>
        
      </div>
      
      <Outlet />
    </Container>
  );
}