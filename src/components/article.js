import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import React, { useState, useRef } from "react";
import { randomArticleTitle, randomArticleBody, randomArticleSubTitle, randomName } from '../utilities/generators';
import ReactQuill from 'react-quill';


//
// article
//

export default function Article() {
    
    const [ title, setTitle] = useState('Untitled Article')
    const [ subTitle, setSubTitle] = useState('Enter subtitle here...')
    const [ author, setAuthor] = useState('John Doe')

    const header = {title, setTitle, subTitle, setSubTitle, author, setAuthor}
 
    return (
        <div className='article'>
            <ArticleHeader canEdit={true} editOnOpen={true} header={header} />
            <hr />
            <ArticleBody />
        </div>
    );
}

//
// article header
//

export function ArticleHeader(props) {
    const [ editing, setEditing] = useState(props.editOnOpen && props.canEdit ? true : false)
    const flipEditing = () => setEditing(!editing)
    const headingClickHandler = () => { if(!editing) flipEditing() }
    const headerClass = (!editing && props.canEdit) ? 'article-header article-header-can-edit' : 'article-header'
    return (
        <div className={headerClass} onClick={headingClickHandler}>
            {editing && <ArticleHeaderForm header={props.header}/>}
            {editing && <Button onClick={flipEditing}>Done</Button>}
            {!editing && <ArticleHeaderViewer header={props.header}/>}
        </div>
    );
}

export function ArticleHeaderViewer(props) {
    const header = props.header
    return (
        <div className='article-header-viewer'>
            <h1 className='article-title'>{header.title}</h1>
            <h2 className='article-subtitle'>{header.subTitle}</h2>
            <p className='article-by-line'>
                <span className='article-by-line-label'>Author :: </span>
                <span className='article-by-line-name'>{header.author}</span>
            </p>
        </div>
    );
}

export function ArticleHeaderForm(props) {
    const header = props.header
    const titleHandler = (e) => { header.setTitle(e.target.value)}
    const randomTitle = () => header.setTitle(randomArticleTitle())

    const subTitleHandler = (e) => { header.setSubTitle(e.target.value)}
    const randomSubTitle = () => header.setSubTitle(randomArticleSubTitle())

    const authorHandler = (e) => { header.setAuthor(e.target.value)}
    const randomAuthor = () => header.setAuthor(randomName())

    return (
    <Form className='article-header-form' style={{width: '70%'}}>
        <InputGroup className="mb-3">
            <Button variant="secondary" id="button-addon1" onClick={randomTitle}>Random</Button>
            <FormControl type='string' placeholder='Enter title...' value={header.title} onChange={titleHandler} />
        </InputGroup>

        <InputGroup className="mb-3">
            <Button variant="secondary" id="button-addon1" onClick={randomSubTitle}>Random</Button>
            <FormControl as='textarea' placeholder='Enter subtitle...' style={{height: '65px'}} value={header.subTitle} onChange={subTitleHandler}/>
        </InputGroup>

        <InputGroup className="mb-3">
            <Button variant="secondary" id="button-addon1" onClick={randomAuthor}>Random</Button>
            <FormControl type='string' placeholder='Enter title...' value={header.author} onChange={authorHandler} />
        </InputGroup>
    </Form>
    );
}

//
// article body
//

export function ArticleBody(props) {
    return (<ArticleBodyForm />)
}

export function ArticleBodyViewer(props) {

}

export function ArticleBodyForm(props) {
    const [value, setValue] = useState('');
    const editorRef = useRef(null);
    const logContents = () => { 
        console.log(editorRef)
        const editor = editorRef.current.getEditor()
        
        console.log(editor.getText())
        console.log(editor.getContents())
     }

    return (
        <div>
            <ReactQuill ref={editorRef} theme="snow" value={value} onChange={setValue} placeholder='Type away!'/>
            <Button onClick={logContents}>Log</Button>
            &emsp;
            <Button onClick={() => setValue(randomArticleBody())}>Random</Button>
        </div>
    );
}