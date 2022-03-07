import Article from '../components/article'
import { useState, useRef } from 'react';
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap'
import Delta from 'quill-delta'

export class ArticleEditor {
    constructor(name, title, subTitle, author, contents) {
        this.defaultName = 'Untitled article.news'
        this.name = name ? name : this.defaultName
        this.title = title ? title : 'Untitled Article'
        this.subTitle = subTitle ? subTitle : 'Enter subtitle here...'
        this.author = author ? author : 'John Doe'
        this.contents = contents ? contents : ''
    }

    makeDelta() {
        const headerDelta = new Delta([
            { insert: this.title },
            { insert: '\n', attributes: { header: 1 } },
            { insert: this.subTitle },
            { insert: '\n', attributes: { header: 2 } },
            { insert: this.author },
            { insert: '\n', attributes: { header: 3 } },
          ])
        return headerDelta.concat(this.contents)
    }

    fileString() {
        return JSON.stringify({article: this.makeDelta().ops})
    }
}


export default function EditPage() {

    //
    // definitions
    //

    const [ showing, setShowing ] = useState('landing')
    const show = (name) => { return name === showing }

    const defaultDoc = new ArticleEditor() 
    const [ doc, setDoc ] = useState({...defaultDoc}) // instantiate to get default values

    const editorRef = useRef(null);

    //
    // handlers
    //

    const updateDoc = (prop, value) => {
        setDoc(prevDoc => {
        const updates = {}
        updates[prop] = value
        return {...prevDoc, ...updates}
        })
    }

    const documentSaveHandler = () => { 
        const newDoc = Object.assign(new ArticleEditor(), doc)
        newDoc.contents = editorRef.current.getEditor().getContents()
        
        console.log(newDoc.fileString())
    }
    
    const article = { doc, setDoc, updateDoc }

    return (
    <main>
        <div className='content'>
        
            <div className='editor-header'>
                {show('landing') && <Button onClick={() => setShowing('article')}>New Article</Button>}
                {!show('landing') && <DocumentName article={article} setShowing={setShowing} />}
            </div>
            
            {show('article') && <Article article={article} editorRef={editorRef} documentSaveHandler={documentSaveHandler} />}
        </div>
    </main>
    );
}

export function DocumentName(props) {
    const [editDocName, setEditDocName] = useState(false)
    const handleDocName = (e) => props.article.updateDoc('name', e.target.value)
    const handleOpenInput = () => { if(!editDocName) setEditDocName(true) }
    const handleCloseInput = () => setEditDocName(false)
    const formClass = editDocName ? 'inline-header editor-document-name' : 'inline-header editor-document-name editor-document-name-closed'

    return (
        <Form className={formClass} onClick={handleOpenInput}>
            <Row style={{padding: 0, margin: 0, columnGap: 0}}>
                <Col xs={4}  className='text-start' style={{columnGap: 0}}>
                    <Button onClick={() => props.setShowing('landing')}>&larr; Back</Button>
                    &emsp;<Form.Label htmlFor="inputPassword5"><strong>editing :: </strong></Form.Label>
                </Col>
                <Col className='text-start' style={{columnGap: 0}}>
                    {!editDocName && <span className='text-start'>{props.article.doc.name}</span>}

                    {editDocName &&
                        <InputGroup className="mb-3">
                            <Form.Control type='text' value={props.article.doc.name} placeholder={props.article.doc.defaultName} onChange={handleDocName} />
                            <Button size='sm' onClick={handleCloseInput}>Done</Button>
                        </InputGroup>
                    }
                </Col>
            </Row>
        </Form>
    )
}