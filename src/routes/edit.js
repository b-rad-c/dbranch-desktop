import ArticleEditor from '../components/editor'
import { useState, useRef, useEffect } from 'react'
import { Button, Alert, Spinner } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { create } from 'ipfs-http-client'
import DocumentListings from '../components/documents'
import { newBlankArticle } from 'dbranch-core'


export default function EditPage(props) {

    //
    // state and handlers
    //

    const location = useLocation()
    let navigate = useNavigate()
    const editorRef = useRef(null)
    const [ loading, setLoading ] = useState(true)

    // editor state & actions
    const [ showEditor, setShowEditor ] = useState(false)
    const openEditor = () => setShowEditor(true)
    const closeEditor = () => {
        setShowEditor(false)
        navigate('/edit')
        const defaultArticle = newBlankArticle()
        setArticle(defaultArticle)
        setDocumentName(defaultArticle.record.name)
    }

    // article / document state & updaters
    const defaultArticle = newBlankArticle()
    const [ documentModifed, setDocumentModifed] = useState(false)
    const [ documentName, setDocumentName] = useState(defaultArticle.record.name)
    const [ article, setArticle ] = useState(defaultArticle) 
    const updateArticleMetadata = (prop, value) => {
        setArticle(prevDoc => {
        const updates = {metadata: {...prevDoc.metadata}}
        updates.metadata[prop] = value
        setDocumentModifed(true)
        return {...prevDoc, ...updates}
        })
    }

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

    // save + publish actions
    const [ runningAction, setRunningAction ] = useState(null)
    const [ actionSuccessful, setActionSuccessful ] = useState(null)
    const [ errorMsg, setErrorMsg ] = useState('')

    const actionIsRunning = (name) => runningAction === name && actionSuccessful !== true
    const actionWasSuccessful = (name) => actionSuccessful === name
    const actionNormal = (name) => !actionIsRunning(name) && !actionWasSuccessful(name)
    const readOnly = runningAction !== null

    // helpers for child components
    const document = { article, setArticle, closeEditor, updateArticleMetadata, documentName, setDocumentName, makeArticle, documentModifed, setDocumentModifed }
    const action = { runningAction, setRunningAction, actionIsRunning, actionWasSuccessful, actionNormal, readOnly }
    
    //
    // (optionally) load document on first render 
    //  - when an article is clicked from the document listings it actually navigates to this URL with the article name as a state and triggers a load
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
                    let article = newBlankArticle()
                    Object.assign(article, JSON.parse(fileData))
                    
                    setArticle(article)
                    
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
        if(actionIsRunning('save')) {
            console.log('saving user document: ' + documentName)

            window.dBranch.writeUserDocument(documentName, articleFileString())
                .then(() => {
                    console.log('user document saved')
                    setActionSuccessful('save')
                    setDocumentModifed(false)
                    setTimeout(() => setActionSuccessful(null), 3000)
                })
                .catch((error) => { console.error(error); setErrorMsg(error.toString())})   
                .finally(() => setRunningAction(null))
        }
    // eslint-disable-next-line
    }, [runningAction])

    //
    // publish document (add to ipfs)
    //

    useEffect(() => {
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
                    const ipfsFilesDest = props.settings.dBranchPublishedDir + '/' + documentName
                    console.log('copying: ' + ipfsSrc + ' to: ' + ipfsFilesDest)

                    //
                    // copy to mutable filesystem if successful
                    //

                    ipfsClient.files.cp(ipfsSrc, ipfsFilesDest, {parents: true, flush: true})
                        .then(() => {
                            setActionSuccessful('publish')
                            setTimeout(() => setActionSuccessful(null), 3000)
                        }).catch((error) => {
                            console.error(error) 
                            setErrorMsg(error.toString())
                        })
                    
                }).catch((error) => {
                    console.error(error) 
                    setErrorMsg(error.toString())

                }).finally(() => setRunningAction(null))
        }
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
                        <Button onClick={openEditor}>New Article</Button>
                        <DocumentListings settings={props.settings} />
                    </div>
                }
            </div>
            
            {showEditor && <ArticleEditor document={document} editorRef={editorRef} action={action} />}
        </div>

    </main>
    );
}
