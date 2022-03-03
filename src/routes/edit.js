import Article from '../components/article'
import { useState } from 'react';
import { Button } from 'react-bootstrap'


export default function EditPage() {
    const [ showing, setShowing ] = useState('landing')
    const show = (name) => { return name === showing }

    const [ documentName ] = useState('Untitled article.news')

    return (
    <main>
        <div className='content'>
        
            <div className='editor-header'>
                {!show('landing') && <Button onClick={() => setShowing('landing')}>&larr; Back</Button>}
                {show('landing') && <Button onClick={() => setShowing('article')}>New Article</Button>}

                {!show('landing') && <p className='inline-header'><strong>editing :: </strong>{documentName}</p>}
            </div>
            
            {show('article') && <Article />}
        </div>
    </main>
    );
}