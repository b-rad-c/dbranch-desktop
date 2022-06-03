import ArticleEditor from '../components/editor'
import { useState, useRef, useEffect } from 'react'
import { Button, Alert, Spinner } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import Delta from 'quill-delta'
import { create } from 'ipfs-http-client'
import DocumentListings from '../components/documents'
import { newBlankArticle } from 'dbranch-core'


export default function EditPage(props) {

    //
    // state and handlers
    //

    // state variables
    const [ loading, setLoading ] = useState(true)
    
    const [ runningAction, setRunningAction ] = useState(null)
    const [ actionSuccessful, setActionSuccessful ] = useState(null)
    const [ errorMsg, setErrorMsg ] = useState('')

    const [ showEditor, setShowEditor ] = useState(false)
    const openEditor = () => setShowEditor(showEditor)
    const closeEditor = () => {
        setShowEditor(false)
    }

    const defaultArticle = newBlankArticle()
    const [ documentName, setDocumentName] = useState(defaultArticle.record.name)
    const [ article, setArticle ] = useState(defaultArticle) 
    const updateArticle = (prop, value) => {
        setArticle(prevDoc => {
        const updates = {}
        updates[prop] = value
        return {...prevDoc, ...updates}
        })
    }

    // dynamic values + misc
    const actionIsRunning = (name) => runningAction === name && actionSuccessful !== true
    const actionWasSuccessful = (name) => actionSuccessful === name
    const actionNormal = (name) => !actionIsRunning(name) && !actionWasSuccessful(name)
    const readOnly = runningAction !== null

    const location = useLocation()
    const editorRef = useRef(null)

    const makeArticle = () => {
        const newArticle = Object.assign(newBlankArticle(), article)
        newArticle.contents = editorRef.current.getEditor().getContents()
        return newArticle
    }

    const articleFileString = () => {
        let article = makeArticle()
        delete article.record
        return JSON.stringify(article)
    }

    // helpers for child components
    const document = { article, setArticle, closeEditor, updateArticle, documentName, setArticleName: setDocumentName, makeArticle }
    const action = { runningAction, setRunningAction, actionIsRunning, actionWasSuccessful, actionNormal, readOnly }
    
    //
    // (optionally) load document on first render
    //

    // pass state.open='file.ext' when navigating to this page to open editor with specified file
    useEffect(() => {
        let openingDoc = false
        let docName = null
        if(location.state !== null) {
            docName = location.state.open
            if(typeof docName !== 'undefined') openingDoc = true
        }
        if(openingDoc) {
            setDocumentName(docName)
            console.log('opening: ' + docName)
            window.dBranch.readUserDocument(docName)
                .then((fileData) => {
                    const loadedDoc = JSON.parse(fileData)
                    
                    setArticle({
                        type: loadedDoc.type,
                        title: loadedDoc.title,
                        subTitle: loadedDoc.subTitle,
                        author: loadedDoc.author,
                        contents: new Delta(loadedDoc.contents.ops)
                    })
                    
                    console.log('load finished')
                    setShowEditor(true)

                }).catch((error) => {
                    console.error(error); 
                    setErrorMsg(error.toString())

                }).finally(() => setLoading(false))

        }else{
            setLoading(false)
        }
        
    }, [location.state])

    //
    // save document (as draft to local filesystem)
    //

    useEffect(() => {
        let timeout = null
        if(actionIsRunning('save')) {
            console.log('saving user document: ' + documentName)

            window.dBranch.writeUserDocument(documentName, articleFileString())
                .then(() => {
                    console.log('user document saved')
                    setActionSuccessful('save'); 
                    timeout = setTimeout(() => setActionSuccessful(null), 3000)
                })
                .catch((error) => { console.error(error); setErrorMsg(error.toString())})   
                .finally(() => setRunningAction(null))
        }
        return () => clearTimeout(timeout)
    })

    //
    // publish document (add to ipfs)
    //

    useEffect(() => {
        let timeout = null
        if(actionIsRunning('publish')) {
            console.log('publishing to ipfs: ' + documentName)

            //
            // add to ipfs
            //

            const ipfsClient = create(props.settings.ipfsHost)
            ipfsClient.add(articleFileString(), {progress: (size) => console.log('progress in bytes:' + size)})
                .then((result) => {
                    console.log(result)
                    const ipfsSrc = '/ipfs/' + result.cid
                    const ipfsFilesDest = window.dBranch.joinPath(props.settings.dBranchPublishedDir, documentName)
                    console.log('copying: ' + ipfsSrc + ' to: ' + ipfsFilesDest)

                    //
                    // copy to mutable filesystem if successful
                    //

                    ipfsClient.files.cp(ipfsSrc, ipfsFilesDest, {parents: true, flush: true})
                        .then(() => {
                            setActionSuccessful('publish')
                            timeout = setTimeout(() => setActionSuccessful(null), 3000)
                        }).catch((error) => {
                            console.error(error) 
                            setErrorMsg(error.toString())
                        })
                    
                }).catch((error) => {
                    console.error(error) 
                    setErrorMsg(error.toString())

                }).finally(() => setRunningAction(null))
        }
        return () => clearTimeout(timeout)
    })

    return (
    <main>
        <Alert variant='danger' show={errorMsg !== ''} dismissible>
            <Alert.Heading>File error</Alert.Heading>
            <p className='alert-text'>{errorMsg}</p>
        </Alert>

        <div className='edit-page-container'>
            <div>
                {loading && <Spinner animation='border' role='status' />}
                {!showEditor && 
                    <div>
                        <Button style={{marginLeft: '2%'}} onClick={openEditor}>New Article</Button>
                        <DocumentListings settings={props.settings} />
                    </div>
                }
            </div>
            
            {showEditor && <ArticleEditor document={document} editorRef={editorRef} action={action} />}
        </div>

    </main>
    );
}
