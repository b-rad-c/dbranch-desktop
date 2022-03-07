import { Form, FormControl, InputGroup, Button, Stack } from 'react-bootstrap'
import React, { useState } from "react"
import { randomArticleTitle, randomArticleBody, randomArticleSubTitle, randomName } from '../utilities/generators'
import ReactQuill from 'react-quill'


//
// article
//

export default function Article(props) {
    const article = props.article
    const documentSaveHandler = props.documentSaveHandler
    const editorRef = props.editorRef

    // body
    const [content, setContent] = useState(article.contents);
    
 
    return (
        <div className='article'>
            <ArticleHeader canEdit={true} editOnOpen={false} article={article} />
            <ArticleBody articleBody={{content, setContent, editorRef, documentSaveHandler}} />
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
            {editing && <ArticleHeaderForm article={props.article}/>}
            {editing && <Button onClick={flipEditing}>Done</Button>}
            {!editing && <ArticleHeaderViewer article={props.article}/>}
        </div>
    );
}

export function ArticleHeaderViewer(props) {
    const doc = props.article.doc
    return (
        <div className='article-header-viewer'>
            <h1 className='article-title'>{doc.title}</h1>
            <h2 className='article-subtitle'>{doc.subTitle}</h2>
            <p className='article-by-line'>
                <span className='article-by-line-label'>Author :: </span>
                <span className='article-by-line-name'>{doc.author}</span>
            </p>
        </div>
    );
}

export function ArticleHeaderForm(props) {
    const article = props.article
    const titleHandler = (e) => article.updateDoc('title', e.target.value)
    const randomTitle = () => article.updateDoc('title', randomArticleTitle())

    const subTitleHandler = (e) => article.updateDoc('subTitle', e.target.value)
    const randomSubTitle = () => article.updateDoc('subTitle', randomArticleSubTitle())

    const authorHandler = (e) => article.updateDoc('author', e.target.value)
    const randomAuthor = () => article.updateDoc('author', randomName())

    return (
    <Form className='article-header-form' style={{width: '70%'}}>
        <InputGroup className="mb-3">
            <Button variant="secondary" id="button-addon1" onClick={randomTitle}>Random</Button>
            <FormControl type='string' placeholder='Enter title...' value={article.doc.title} onChange={titleHandler} />
        </InputGroup>

        <InputGroup className="mb-3">
            <Button variant="secondary" id="button-addon1" onClick={randomSubTitle}>Random</Button>
            <FormControl as='textarea' placeholder='Enter subtitle...' style={{height: '65px'}} value={article.doc.subTitle} onChange={subTitleHandler}/>
        </InputGroup>

        <InputGroup className="mb-3">
            <Button variant="secondary" id="button-addon1" onClick={randomAuthor}>Random</Button>
            <FormControl type='string' placeholder='Enter title...' value={article.doc.author} onChange={authorHandler} />
        </InputGroup>
    </Form>
    );
}

//
// article body
//

export function ArticleBody(props) {
    return (<ArticleBodyForm articleBody={props.articleBody} />)
}

export function ArticleBodyViewer(props) {

}

export function ArticleBodyForm(props) {
    const body = props.articleBody

    return (
        <div className='mt-2'>
            <ReactQuill ref={body.editorRef} theme="snow" value={body.content} onChange={body.setContent} placeholder='Type away!'/>
            <Stack className='mt-2' direction='horizontal' gap={2}>
                <Button onClick={body.documentSaveHandler}>Save</Button>
                <Button onClick={() => body.setContent(randomArticleBody())}>Random</Button>
            </Stack>
            
        </div>
    );
}