import { Button } from 'react-bootstrap'
import { useNavigate, useLocation } from "react-router-dom";

export default function Settings() {
let navigate = useNavigate()
let location = useLocation();
const goBack = () => { 
    const returnTo = location.state.returnTo ? location.state.returnTo : '/'
    console.log('closing settings', returnTo); 
    navigate(returnTo) 
}
return (
<main>
    <h1>Settings</h1>
    <Button onClick={goBack} className='btn-close'></Button>
</main>
);
}