import ArticleEditor from '../components/article'
import { useState, useRef, useEffect } from 'react'
import { Button, Alert, Spinner } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import Delta from 'quill-delta'
import { create } from 'ipfs-http-client'
import { Article } from 'dbranch-core'


export default function EditPage(props) {

    //
    // state and handlers
    //

    // state variables
    const [ loading, setLoading ] = useState(true)
    const [ showEditor, setShowEditor ] = useState(false)
    const [ runningAction, setRunningAction ] = useState(null)
    const [ actionSuccessful, setActionSuccessful ] = useState(null)
    const [ errorMsg, setErrorMsg ] = useState('')
    const [ documentName, setDocumentName] = useState('Untitled article.news')

    const defaultDoc = new Article() // instantiate to get default values
    const [ doc, setDoc ] = useState({...defaultDoc}) 

    // updaters
    const toggleEditor = () => setShowEditor(!showEditor)

    const updateDoc = (prop, value) => {
        setDoc(prevDoc => {
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
    const toggleButtonLabel = showEditor ? 'Back' : 'New Article'

    const location = useLocation()
    const editorRef = useRef(null)

    const makeArticle = () => {
        const newArticle = Object.assign(new Article(), doc)
        newArticle.contents = editorRef.current.getEditor().getContents()
        return newArticle
    }

    // helpers for child components
    const article = { doc, setDoc, updateDoc, documentName, setDocumentName }
    const action = { runningAction, setRunningAction, actionIsRunning, actionWasSuccessful, actionNormal, readOnly }
    
    //
    // (optionally) load document on first render
    //

    // pass state.open='file.ext' when navigating to this page
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
                    console.log(fileData)

                    const loadedDoc = Article.fromJSONString(fileData)
                    
                    setDoc({
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
            const articleToSave = makeArticle()
            console.log('saving user document: ' + documentName)

            window.dBranch.writeUserDocument(documentName, articleToSave.toJSONString())
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
            const articleToPublish = makeArticle()
            const fileContents = articleToPublish.toJSONString()
            console.log('publishing to ipfs: ' + documentName)
            console.log(fileContents)

            //
            // add to ipfs
            //

            const ipfsClient = create(props.settings.ipfsHost)
            ipfsClient.add(fileContents, {progress: (size) => console.log('progress in bytes:' + size)})
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
        <div className='content'>
        
            <div className='article-editor-toolbar'>
                {loading && <Spinner animation='border' role='status' />}
                {!loading && <Button onClick={toggleEditor}>{toggleButtonLabel}</Button>}
            </div>
            
            {showEditor && <ArticleEditor article={article} editorRef={editorRef} action={action} />}
        </div>
    </main>
    );
}
