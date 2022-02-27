import { useState } from 'react'
import { Button } from 'react-bootstrap'

export default function MainTab() {
const [ num, setNum ] = useState(0)
const incNum = () => setNum(num + 1)
return (
<main>
    <div className='content'>
        <h3>Title</h3>
        <p>num: {num}</p>
        {num === 3 && <p>3</p>}
        <Button onClick={incNum}>increment</Button>
    </div>
</main>
);
}