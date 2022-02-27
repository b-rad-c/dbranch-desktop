import { Button } from 'react-bootstrap'


export default function Settings(props) {
return (
<main>
    <h1>Settings</h1>
    <Button onClick={props.toggleSettings} className='btn-close position-absolute' style={{top: '1.5%', left: '97%'}}></Button>
</main>
);
}