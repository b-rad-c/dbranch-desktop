import { useState } from 'react'
import { Button } from 'react-bootstrap'

export default function MainPage() {
const [ num, setNum ] = useState(0)
const incNum = () => setNum(num + 1)
return (
<main>
    <div className='content'>
        <h3>Main</h3>
        <p>num: {num}</p>
        <Button onClick={incNum}>increment</Button>
    </div>
</main>
);
}