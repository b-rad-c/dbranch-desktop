import ArticleEditor from '../components/article'
import { useState, useRef, useEffect } from 'react'
import { Button, Alert, Spinner } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import Delta from 'quill-delta'


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


export default function EditPage() {

    //
    // state and handlers
    //

    const location = useLocation()

    const [ loading, setLoading ] = useState(true)
    const [ showEditor, setShowEditor ] = useState(false)
    const [ savingDocument, setSavingDocument ] = useState(false)
    const saveDocument = () => setSavingDocument(true)

    const [ saveSuccessful, setSaveSuccessful ] = useState(false)

    const toggleEditor = () => setShowEditor(!showEditor)
    const toggleButtonLabel = showEditor ? 'Back' : 'New Article'

    const [ errorMsg, setErrorMsg ] = useState('')

    const defaultDoc = new Article() // instantiate to get default values
    const [ doc, setDoc ] = useState({...defaultDoc}) 

    const updateDoc = (prop, value) => {
        setDoc(prevDoc => {
        const updates = {}
        updates[prop] = value
        return {...prevDoc, ...updates}
        })
    }

    const article = { doc, setDoc, updateDoc }
    const editorRef = useRef(null)

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
    // save document
    //

    useEffect(() => {
        if(savingDocument) {
            const newDoc = Object.assign(new Article(), doc)
            console.log('saving user document: ' + newDoc.name)
            
            newDoc.contents = editorRef.current.getEditor().getContents()

            window.dBranch.writeUserDocument(newDoc.name, newDoc.toJSONString())
                .then(() => {
                    console.log('user document saved')
                    setSaveSuccessful(true); 
                    setTimeout(() => setSaveSuccessful(false), 3000)
                })
                .catch((error) => { console.error(error); setErrorMsg(error.toString())})   
                .finally(() => setSavingDocument(false))
        }
        
    }, [savingDocument, doc])

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
            
            {showEditor && <ArticleEditor article={article} editorRef={editorRef} saveDocument={saveDocument} savingDocument={savingDocument} saveSuccessful={saveSuccessful} />}
        </div>
    </main>
    );
}
