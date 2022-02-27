import { Button } from 'react-bootstrap'
import { useNavigate, useLocation } from "react-router-dom";

export default function Settings() {
console.log(useLocation())
let navigate = useNavigate()
const goBack = () => { console.log('closing settings'); navigate(-1) }
return (
<main>
    <h1>Settings</h1>
    <Button onClick={goBack} className='btn-close'></Button>
</main>
);
}