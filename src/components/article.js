import { Form, FormControl, InputGroup, Button, Stack, Row, Col, Spinner } from 'react-bootstrap'
import React, { useState } from 'react'
import { randomArticleTitle, randomArticleBody, randomArticleSubTitle, randomName } from '../utilities/generators'
import ReactQuill from 'react-quill'
import { Check2Circle } from 'react-bootstrap-icons'

//
// article
//

export default function ArticleEditor(props) {
    return (
        <div className='article'>
            <ArticleEditorHeader article={props.article} action={props.action} />
            <ArticleEditorBody article={props.article} action={props.action} editorRef={props.editorRef}/>
        </div>
    );
}

//
// article header
//


export function ArticleEditorHeader(props) {
    const article = props.article
    const disabled = props.action.readOnly
    const nameHandler = (e) => article.updateDoc('name', e.target.value)

    const titleHandler = (e) => article.updateDoc('title', e.target.value)
    const randomTitle = () => article.updateDoc('title', randomArticleTitle())

    const subTitleHandler = (e) => article.updateDoc('subTitle', e.target.value)
    const randomSubTitle = () => article.updateDoc('subTitle', randomArticleSubTitle())

    const authorHandler = (e) => article.updateDoc('author', e.target.value)
    const randomAuthor = () => article.updateDoc('author', randomName())

    return (
    <Form className='article-header-form' style={{width: '70%'}}>
        <Form.Group as={Row} className='mb-3'>
            <Form.Label column sm={2}>document ::</Form.Label>
            <Col>
                <FormControl disabled={disabled} type='string' placeholder='Enter filename...' value={article.doc.name} onChange={nameHandler} />
            </Col>
        </Form.Group>
            
        <Form.Group as={Row} className='mb-3'>
            <Form.Label column sm={2}>title ::</Form.Label>
            <Col>
                <InputGroup className='mb-3'>
                    <Button disabled={disabled} variant='secondary' id='button-addon1' onClick={randomTitle}>Random</Button>
                    <FormControl disabled={disabled} type='string' placeholder='Enter title...' value={article.doc.title} onChange={titleHandler} />
                </InputGroup>
            </Col>
        </Form.Group>

        <Form.Group as={Row} className='mb-3'>
            <Form.Label column sm={2}>subtitle ::</Form.Label>
            <Col>
                <InputGroup className='mb-3'>
                    <Button disabled={disabled} variant='secondary' id='button-addon1' onClick={randomSubTitle}>Random</Button>
                    <FormControl disabled={disabled} as='textarea' placeholder='Enter subtitle...' style={{height: '65px'}} value={article.doc.subTitle} onChange={subTitleHandler}/>
                </InputGroup>
            </Col>
        </Form.Group>
        
        <Form.Group as={Row} className='mb-3'>
            <Form.Label column sm={2}>author ::</Form.Label>
            <Col>
                <InputGroup className='mb-3'>
                    <Button disabled={disabled} variant='secondary' id='button-addon1' onClick={randomAuthor}>Random</Button>
                    <FormControl disabled={disabled} type='string' placeholder='Enter title...' value={article.doc.author} onChange={authorHandler} />
                </InputGroup>
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

    const save = () => action.setRunningAction('save')
    const publish = () => action.setRunningAction('publish')

    const Spin = (<Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />)


    return (
        <div className='mt-2'>
            <ReactQuill ref={props.editorRef} readOnly={action.readOnly} theme='snow' value={quillValue} onChange={setQuillValue} placeholder='Type away!'/>
            <Stack className='mt-2' direction='horizontal' gap={2}>

                {/* save button */}
                <Button disabled={action.readOnly} onClick={save}>
                    { action.actionIsRunning('save')        && Spin}
                    { action.actionWasSuccessful('save')    && <Check2Circle />}
                    { action.actionNormal('save')           && <span>Save</span>}
                </Button>

                {/* publish button */}
                <Button disabled={action.readOnly} onClick={publish}>
                    { action.actionIsRunning('publish')     && Spin}
                    { action.actionWasSuccessful('publish') && <Check2Circle />}
                    { action.actionNormal('publish')        && <span>Publish</span>}
                </Button>

                {/* random article generator*/}
                <Button disabled={action.readOnly} onClick={() => setQuillValue(randomArticleBody())}>Random</Button>
            </Stack>
        </div>
    );
}