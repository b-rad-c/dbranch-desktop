import ArticleEditor from '../components/article'
import { useState, useRef, useEffect } from 'react'
import { Button, Alert } from 'react-bootstrap'
import Delta from 'quill-delta'
import { useLocation } from 'react-router-dom'


export class Article {
    constructor(name, title, subTitle, author, contents) {
        this.defaultName = 'Untitled article.news'
        this.name = name ? name : this.defaultName
        this.title = title ? title : 'Untitled Article'
        this.subTitle = subTitle ? subTitle : 'Enter subtitle here...'
        this.author = author ? author : 'John Doe'
        this.contents = contents ? contents : ''
    }

    makeDelta() {
        const headerDelta = new Delta([
            { insert: this.title },
            { insert: '\n', attributes: { header: 1 } },
            { insert: this.subTitle },
            { insert: '\n', attributes: { header: 2 } },
            { insert: this.author },
            { insert: '\n', attributes: { header: 3 } },
          ])
        return headerDelta.concat(this.contents)
    }

    fileString() {
        return JSON.stringify({article: this.makeDelta().ops})
    }
}

function loadArticle(fileName) {
    // window.dBranch.loadUserDocument(fileName)

    // parse JSON contents of file

    // return new Article(<parsed json data>)
}


export default function EditPage() {
    const location = useLocation()
    console.log(location)

    const [ showEditor, setShowEditor ] = useState(false)
    const [ savingDocument, setSavingDocument ] = useState(false)
    const saveDocument = () => setSavingDocument(true)

    const [ saveSuccessful, setSaveSuccessful ] = useState(false)

    const toggleEditor = () => setShowEditor(!showEditor)
    const toggleButtonLabel = showEditor ? 'Back' : 'New Article'

    const [ errorMsg, setErrorMsg ] = useState('')

    const defaultDoc = new Article() 
    const [ doc, setDoc ] = useState({...defaultDoc}) // instantiate to get default values

    const updateDoc = (prop, value) => {
        setDoc(prevDoc => {
        const updates = {}
        updates[prop] = value
        return {...prevDoc, ...updates}
        })
    }

    const article = { doc, setDoc, updateDoc }

    const editorRef = useRef(null)

    useEffect(() => {
        // after initial load
        // if opening existing document:
            // set loading
            // loadArticle()
        
        // set article to doc
        
        // setShowEditor(true) && loading=false
    }, [])

    useEffect(() => {
        if(savingDocument) {
            const newDoc = Object.assign(new Article(), doc)
            console.log('saving user document: ' + newDoc.name)
            
            newDoc.contents = editorRef.current.getEditor().getContents()

            window.dBranch.writeUserDocument(newDoc.name, newDoc.fileString())
                .then(() => {
                    console.log('user document saved')
                    setSaveSuccessful(true); 
                    setTimeout(() => setSaveSuccessful(false), 3000)
                })
                .catch((err) => { console.error(err); setErrorMsg(err.toString())})   
                .finally(() => setSavingDocument(false))
        }
        
    }, [savingDocument, doc])

    return (
    <main>
        <Alert variant='danger' show={errorMsg !== ''} dismissible>
            <Alert.Heading>Error saving file</Alert.Heading>
            <p className='alert-text'>{errorMsg}</p>
        </Alert>
        <div className='content'>
        
            <div className='editor-header'>
                <Button onClick={toggleEditor}>{toggleButtonLabel}</Button>
            </div>
            
            {showEditor && <ArticleEditor article={article} editorRef={editorRef} saveDocument={saveDocument} savingDocument={savingDocument} saveSuccessful={saveSuccessful} />}
        </div>
    </main>
    );
}
