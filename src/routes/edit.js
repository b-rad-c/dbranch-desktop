import ArticleEditor from '../components/article'
import { useState, useRef, useEffect } from 'react'
import { Button, Alert, Spinner } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import Delta from 'quill-delta'
//import { create } from 'ipfs-http-client'


export class Article {
    constructor(name, title, subTitle, author, contents) {
        this.defaultName = 'Untitled article.news'
        this.name = name ? name : this.defaultName
        this.title = title ? title : 'Untitled Article'
        this.subTitle = subTitle ? subTitle : 'Enter subtitle here...'
        this.author = author ? author : 'John Doe'
        this.contents = contents ? contents : ''
    }

    toJSON() {
        return {
            title: this.title,
            subTitle: this.subTitle,
            author: this.author,
            contents: this.contents
        }
    }

    toJSONString() {
        return JSON.stringify(this.toJSON())
    }

    static fromJSON(name, data) {
        return new Article(name, data.title, data.subTitle, data.author, data.contents)
    }

    static fromJSONString(name, jsonString) {
        return Article.fromJSON(name, JSON.parse(jsonString))
    }
}


export default function EditPage(props) {

    //
    // state and handlers
    //

    const location = useLocation()
    const editorRef = useRef(null)

    // state variables
    const [ loading, setLoading ] = useState(true)
    const [ showEditor, setShowEditor ] = useState(false)
    const [ runningAction, setRunningAction ] = useState(null)
    const [ actionSuccessful, setActionSuccessful ] = useState(null)
    const [ errorMsg, setErrorMsg ] = useState('')

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

    // dynamic values
    const actionIsRunning = (name) => runningAction === name && actionSuccessful !== true
    const actionWasSuccessful = (name) => actionSuccessful === name
    const actionNormal = (name) => !actionIsRunning(name) && !actionWasSuccessful(name)
    const readOnly = runningAction !== null
    const toggleButtonLabel = showEditor ? 'Back' : 'New Article'

    // helpers for child components
    const article = { doc, setDoc, updateDoc }
    const action = { runningAction, setRunningAction, actionIsRunning, actionWasSuccessful, actionNormal, readOnly }
    
    //
    // (optionally) load document on first render
    //

    useEffect(() => {
        let openingDoc = false
        let docName = null
        if(location.state !== null) {
            docName = location.state.open
            if(typeof docName !== 'undefined') openingDoc = true
        }
        if(openingDoc) {
            console.log('opening: ' + docName)
            window.dBranch.readUserDocument(docName)
                .then((fileData) => {
                    console.log(fileData)

                    const loadedDoc = Article.fromJSONString(docName, fileData)
                    
                    setDoc({
                        name: loadedDoc.name,
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
        if(actionIsRunning('save')) {
            const newDoc = Object.assign(new Article(), doc)
            console.log('saving user document: ' + newDoc.name)
            
            newDoc.contents = editorRef.current.getEditor().getContents()

            window.dBranch.writeUserDocument(newDoc.name, newDoc.toJSONString())
                .then(() => {
                    console.log('user document saved')
                    setActionSuccessful('save'); 
                    setTimeout(() => setActionSuccessful(null), 3000)
                })
                .catch((error) => { console.error(error); setErrorMsg(error.toString())})   
                .finally(() => setRunningAction(null))
        }
    })

    //
    // publish document (add to ipfs)
    //

    useEffect(() => {
        if(actionIsRunning('publish')) {
            console.log('publishing: ' + doc.name)
            // const client = create(props.settings.ipfsHost)
            // add to ipfs
            // add cid to MFS
            // setTimeout(() => setRunningAction(false), 2000)
        }
        
    })

    return (
    <main>
        <Alert variant='danger' show={errorMsg !== ''} dismissible>
            <Alert.Heading>File error</Alert.Heading>
            <p className='alert-text'>{errorMsg}</p>
        </Alert>
        <div className='content'>
        
            <div className='editor-header'>
                {loading && <Spinner />}
                {!loading && <Button onClick={toggleEditor}>{toggleButtonLabel}</Button>}
            </div>
            
            {showEditor && <ArticleEditor article={article} editorRef={editorRef} action={action} />}
        </div>
    </main>
    );
}
