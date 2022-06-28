import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import { ArticleReaderModal } from 'dbranch-core'
import { Check2Circle, CaretRightFill, CaretDownFill } from 'react-bootstrap-icons'
import { Form, FormControl, Button, Stack, Row, Col, Spinner } from 'react-bootstrap'


//
// article
//

export default function ArticleEditor(props) {
    const [showPreview, setShowPreview] = useState(false)
    const [articlePreview, setArticlePreview] = useState(null)

    const openArticlePreview = () => { 
        setArticlePreview(props.document.makeArticle())
        setShowPreview(true) 
    }

    return (
        <div className='article-editor'>

            <ArticleReaderModal 
                show=           {showPreview} 
                closeArticle=   {() => { setShowPreview(false) } }
                onExited=       {() => { setArticlePreview(null) }}
                modalTitle=     {props.document.documentName} 
                article=        {articlePreview} 
                />  

            <ArticleEditorToolbar 
                document={props.document} 
                action={props.action} 
                setShowPreview={setShowPreview} 
                openArticlePreview={openArticlePreview} 
                />

            <ArticleEditorHeader document={props.document} action={props.action} />
            <ArticleEditorBody document={props.document} action={props.action} editorRef={props.editorRef}/>

        </div>
    );
}

export function ArticleEditorToolbar(props) {

    const action = props.action
    const modified = props.document.documentModifed

    const save = () => action.setRunningAction('save')
    const publish = () => action.setRunningAction('publish')

    const Spin = (<Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />)
    
    const variant = 'outline-dark'
    return (
        <Stack className='article-editor-toolbar' direction='horizontal' gap={2}>

            <Button variant={variant} onClick={props.document.closeEditor}>Close</Button>

            {/* save button */}
            <Button variant={variant} disabled={action.readOnly} onClick={save}>
                { action.actionIsRunning('save')        && Spin}
                { action.actionWasSuccessful('save')    && <Check2Circle />}
                { action.actionNormal('save')           && <span>Save{modified && <span>*</span>}</span>}
            </Button>

            {/* preview button */}
            <Button variant={variant} disabled={action.readOnly} onClick={props.openArticlePreview}>Preview</Button>

            {/* publish button */}
            <Button variant={variant} disabled={action.readOnly} onClick={publish}>
                { action.actionIsRunning('publish')     && Spin}
                { action.actionWasSuccessful('publish') && <Check2Circle />}
                { action.actionNormal('publish')        && <span>Publish</span>}
            </Button>

        </Stack>
    );
}

//
// article header
//


export function ArticleEditorHeader(props) {
    
    const document = props.document
    const metadata = document.article.metadata
    const disabled = props.action.readOnly

    const [collapsed, setCollapsed] = useState(false)
    const toggleCollapsed = () => setCollapsed(!collapsed)

    const nameHandler = (e) => { document.setDocumentName(e.target.value); document.setDocumentModifed(true) }
    const typeHandler = (e) => document.updateArticleMetadata('type', e.target.value)
    const titleHandler = (e) => document.updateArticleMetadata('title', e.target.value)
    const subTitleHandler = (e) => document.updateArticleMetadata('sub_title', e.target.value)
    const authorHandler = (e) => document.updateArticleMetadata('author', e.target.value)

    const rowClass = 'mb-3 text-end'

    return (
    <Form className='article-editor-header'>
        <Form.Group as={Row} className={rowClass}>
            <Col sm={1}>
                <Button variant='outline-dark' onClick={toggleCollapsed}>
                    {collapsed && <CaretRightFill size={16}/>}
                    {!collapsed && <CaretDownFill size={16}/>}
                </Button>
            </Col>
        
            <Form.Label column sm={2}>document ::</Form.Label>
            
            <Col>
                <FormControl disabled={disabled} type='string' placeholder='Enter filename...' value={document.documentName} onChange={nameHandler} />
            </Col>
        </Form.Group>

        {
            !collapsed &&
            <span>
                <Form.Group as={Row} className={rowClass}>
                    <Col sm={1} />
                    <Form.Label column sm={2}>type ::</Form.Label>
                    <Col>
                        <Form.Select value={metadata.type} onChange={typeHandler}>
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
                    <Col sm={1} />
                    <Form.Label column sm={2}>title ::</Form.Label>
                    <Col>
                        <FormControl disabled={disabled} type='string' placeholder='Enter title...' value={metadata.title} onChange={titleHandler} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className={rowClass}>
                    <Col sm={1} />
                    <Form.Label column sm={2}>subtitle ::</Form.Label>
                    <Col>
                        <FormControl disabled={disabled} as='textarea' placeholder='Enter subtitle...' value={metadata.sub_title} onChange={subTitleHandler}/>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} className={rowClass}>
                    <Col sm={1} />
                    <Form.Label column sm={2}>author ::</Form.Label>
                    <Col>
                        <FormControl disabled={disabled} type='string' placeholder='Enter title...' value={metadata.author} onChange={authorHandler} />
                    </Col>
                </Form.Group>
            </span>
        }
        
    </Form>
    );
}

//
// article body
//

export function ArticleEditorBody(props) {
    const [quillValue, setQuillValue] = useState(props.document.article.contents)


    return (
        <div className='mt-2'>

            { /* actual editing canvas */}

            <div className='article-editor-container'>
                <ReactQuill 
                    ref=           {props.editorRef} 
                    bounds=        'article-editor-container'
                    readOnly=      {props.action.readOnly} 
                    theme=         'snow' 
                    value=         {quillValue} 
                    onChange=      {setQuillValue} 
                    placeholder=   'Type away!' 
                    />
            </div>

        </div>
    );
}