import { Button } from 'react-bootstrap';
import { useState } from 'react';

export default function MainPage() {

const [ num, setNum ] = useState(0)
const incNum = () => setNum(num + 1)

return (
<main>
    <div className='content'>
        <h3>Main</h3>
        <p>num: {num} {num === 3 && <span>Hi :)</span>}</p>
        <Button onClick={incNum}>increment</Button>
        <p>hello.world</p>
    </div>
</main>
);
}