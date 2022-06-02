import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import { ArticleReaderModal } from 'dbranch-core'
import { Check2Circle } from 'react-bootstrap-icons'
import { Form, FormControl, Button, Stack, Row, Col, Spinner } from 'react-bootstrap'


//
// article
//

export default function ArticleEditor(props) {
    const [showPreview, setShowPreview] = useState(false)
    const [articlePreview, setArticlePreview] = useState(null)
    const [showHeader, setShowHeader] = useState(true)

    const toggleHeader = () => setShowHeader(!showHeader)

    return (
        <div className='article-editor'>

            <ArticleReaderModal 
                show=           {showPreview} 
                closeArticle=   {() => { setShowPreview(false) } }
                onExited=       {() => { setArticlePreview(null) }}
                modalTitle=     {props.article.documentName} 
                article=        {articlePreview} 
                />  

            <ArticleEditorToolbar 
                article={props.article} 
                action={props.action} 
                setShowPreview={setShowPreview} 
                setArticlePreview={setArticlePreview} 
                closeEditor={props.closeEditor}
                toggleHeader={toggleHeader}
                />

            {showHeader && <ArticleEditorHeader article={props.article} action={props.action} />}
            <ArticleEditorBody article={props.article} action={props.action} editorRef={props.editorRef}/>

        </div>
    );
}

export function ArticleEditorToolbar(props) {

    const action = props.action

    const save = () => action.setRunningAction('save')
    const publish = () => action.setRunningAction('publish')
    const openArticle = () => { props.setArticlePreview(props.article.makeArticle()); props.setShowPreview(true) }

    const Spin = (<Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />)

    return (
        <Stack className='article-editor-toolbar' direction='horizontal' gap={2}>

            <Button onClick={props.closeEditor}>Close</Button>

            {/* save button */}
            <Button disabled={action.readOnly} onClick={save}>
                { action.actionIsRunning('save')        && Spin}
                { action.actionWasSuccessful('save')    && <Check2Circle />}
                { action.actionNormal('save')           && <span>Save</span>}
            </Button>

            {/* preview button */}
            <Button disabled={action.readOnly} onClick={openArticle}>Preview</Button>

            {/* publish button */}
            <Button disabled={action.readOnly} onClick={publish}>
                { action.actionIsRunning('publish')     && Spin}
                { action.actionWasSuccessful('publish') && <Check2Circle />}
                { action.actionNormal('publish')        && <span>Publish</span>}
            </Button>

            <Button onClick={props.toggleHeader}>Toggle header</Button>
        </Stack>
    );
}

//
// article header
//


export function ArticleEditorHeader(props) {

    const article = props.article
    const disabled = props.action.readOnly

    const nameHandler = (e) => article.setDocumentName(e.target.value)
    const typeHandler = (e) => article.updateDoc('type', e.target.value)
    const titleHandler = (e) => article.updateDoc('title', e.target.value)
    const subTitleHandler = (e) => article.updateDoc('subTitle', e.target.value)
    const authorHandler = (e) => article.updateDoc('author', e.target.value)

    const rowClass = 'mb-3 text-end'

    return (
    <Form className='article-editor-header' style={{width: '70%'}}>
        <Form.Group as={Row} className={rowClass}>
            <Form.Label column sm={2}>document ::</Form.Label>
            <Col>
                <FormControl disabled={disabled} type='string' placeholder='Enter filename...' value={article.documentName} onChange={nameHandler} />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className={rowClass}>
            <Form.Label column sm={2}>type ::</Form.Label>
            <Col>
                <Form.Select value={article.doc.type} onChange={typeHandler}>
                    <option value='news'>news</option>
                    <option value='opinion'>opinion</option>
                    <option value='review'>review</option>
                    <option value='information'>information</option>
                    <option value='context'>context</option>
                    <option value='question'>question</option>
                    <option value='answer'>answer</option>
                    <option value='satire'>satire</option>
                </Form.Select>
            </Col>
        </Form.Group>
            
        <Form.Group as={Row} className={rowClass}>
            <Form.Label column sm={2}>title ::</Form.Label>
            <Col>
                <FormControl disabled={disabled} type='string' placeholder='Enter title...' value={article.doc.title} onChange={titleHandler} />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className={rowClass}>
            <Form.Label column sm={2}>subtitle ::</Form.Label>
            <Col>
                <FormControl disabled={disabled} as='textarea' placeholder='Enter subtitle...' style={{height: '65px'}} value={article.doc.subTitle} onChange={subTitleHandler}/>
            </Col>
        </Form.Group>
        
        <Form.Group as={Row} className={rowClass}>
            <Form.Label column sm={2}>author ::</Form.Label>
            <Col>
                <FormControl disabled={disabled} type='string' placeholder='Enter title...' value={article.doc.author} onChange={authorHandler} />
            </Col>
        </Form.Group>
        
    </Form>
    );
}

//
// article body
//

export function ArticleEditorBody(props) {
    const action = props.action
    const [quillValue, setQuillValue] = useState(props.article.doc.contents)

    return (
        <div className='mt-2'>

            { /* actual editing canvas */}

            <div className='article-editor-container'>
                <ReactQuill 
                    ref=           {props.editorRef} 
                    style=         {{height: '90%'}} 
                    readOnly=      {action.readOnly} 
                    theme=         'snow' 
                    value=         {quillValue} 
                    onChange=      {setQuillValue} 
                    placeholder=   'Type away!' 
                    />
            </div>

        </div>
    );
}