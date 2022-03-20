import { Alert, Modal } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { create } from 'ipfs-http-client'
import { Article } from 'dbranch-core'
import ReactQuill from 'react-quill'


function DisplayArticle(props) {
    return (
        <div className='article-reader-container'>
            <div className='article-reader-header'>
                <h1 className='article-reader-title'>{props.article.title}</h1>
                <h2 className='article-reader-subtitle'>{props.article.subTitle}</h2>
                <p className='article-reader-by-line'>
                    <em>{props.article.type}</em>
                    <br />
                    <em>written by:</em> {props.article.author}
                </p>
            </div>
            <ReactQuill 
                className='article-reader-body'
                theme={null}
                value={props.article.contents} 
                readOnly
                />
        </div>
    )
}


export default function ReaderModal(props) {
    
    //
    // state
    //

    const [loading, setLoading] = useState(true)
    const [article, setArticle] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const modalTitle = props.loadArticle ? props.loadArticle : 'Document preview'

    const closeAction = () => { setLoading(true); props.closeArticle() }

    //
    // load document
    //

    async function loadIPFSFile(path) {
        const ipfsClient = create(props.settings.ipfsHost)
        
        let result = ''
        let utf8decoder = new TextDecoder();
        for await (const chunk of ipfsClient.files.read(path)) {
            result += utf8decoder.decode(chunk)
        }
        return result
    }

    useEffect(() => {
        if(props.show) {
            const path = window.dBranch.joinPath(props.settings.dBranchPublishedDir, props.loadArticle)
            console.log('loading from ipfs: ' + path)
            loadIPFSFile(path)
                .then((result) => {
                    console.log('article loaded successfully')
                    setArticle(Article.fromJSONString(result))
                }).catch((error) => {
                    console.error(error)
                    setErrorMsg(error.toString())
                }).finally(() => setLoading(false))
            
            
        }
    // eslint-disable-next-line
    }, [props.show])
    
    return (
        <Modal show={props.show} onHide={closeAction} dialogClassName='article-reader-modal'>
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Alert variant='danger' show={errorMsg !== ''} onClose={() => setErrorMsg('')} dismissible>
                    <Alert.Heading>Error loading article</Alert.Heading>
                    <p className='alert-text'>{errorMsg}</p>
                </Alert>
            
                {loading && <Spinner animation='border' role='status' />}
                {!loading && !errorMsg && <DisplayArticle article={article} />}
            
            </Modal.Body>
      </Modal>
    )
}