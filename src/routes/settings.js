import { Button } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";

export default function Settings() {
let navigate = useNavigate()
const goBack = () => { console.log('closing settings'); navigate(-1) }
return (
<main>
    <h1>Settings</h1>
    <Button onClick={goBack} className='btn-close'></Button>
</main>
);
}