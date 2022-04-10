import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { PencilSquare, Send } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';
import { create } from 'ipfs-http-client'
import { ArticleReaderModal, loadArticleFromIPFS } from 'dbranch-core'


export default function FilesPage(props) {

    //
    // state variables
    //

    const settings = props.settings

    const [loading, setLoading] = useState(true)
    const [drafts, setDrafts] = useState([])
    const [publishedDocs, setPublishedDocs] = useState([])
    const [ipfsErrorMsg, setIpfsErrorMsg] = useState('')
    const [localErrorMsg, setLocalErrorMsg] = useState('')

    const [selectedArticleName, setSelectedArticleName] = useState(null)
    const [selectedArticle, setSelectedArticle] = useState(null)
    const [showArticle, setShowArticle] = useState(false)

    const getPublishedPath = (filename) => window.dBranch.joinPath(props.settings.dBranchPublishedDir, filename)


    //
    // load file listings (run automatically on first render)
    //

    async function loadIPFSDocs() {
        console.log('listing published documents...')
        const names = []
        const ipfsClient = create(settings.ipfsHost)
        for await (const f of ipfsClient.files.ls(settings.dBranchPublishedDir)) {
            names.push(f.name)
        }
        return names
    }

    useEffect(() => {
        loadIPFSDocs()
            .then((result) => {
                console.log('ipfs files', result)
                setPublishedDocs(result)
            }).catch((error) => {
                console.error(error) 
                setIpfsErrorMsg(error.toString())
            }).finally(() => setLoading(false))
    // eslint-disable-next-line
    }, [])

    useEffect(() => {
        console.log('listing user documents...')
        window.dBranch.listUserDocuments()
            .then((result) => {
                const docs = result.filter((name) => !name.startsWith('.') )
                console.log('user docs:', docs)
                setDrafts(docs)
            }).catch((error) => {
                console.error(error) 
                setLocalErrorMsg(error.toString())
            })
    }, [])


    //
    // open an article from ipfs 
    //

    const openArticle = (e, name) => { setSelectedArticleName(name); e.preventDefault() }
    const closeArticle = () => { setShowArticle(false) }
    const cleanUpArticle = () => { setSelectedArticleName(null); setSelectedArticle(null) }

    const notifyWire = (name) => {
        const localPath = getPublishedPath(name)

        const client = create(props.settings.ipfsHost)

        client.files.stat(localPath)
            .then((stat) => {
                const payload = {name: name, cid: stat.cid.toString()}
                console.log(payload)
                client.pubsub.publish(props.settings.wireChannel, JSON.stringify(payload))
            }).catch((error) => {
                console.error(error)
                setIpfsErrorMsg(error.toString())
            })


        
    }

    useEffect(() => {
        if(selectedArticleName !== null) {
            const path = getPublishedPath(selectedArticleName)
            console.log('loading from ipfs: ' + path)
            
            loadArticleFromIPFS(create(props.settings.ipfsHost), path)
                .then((result) => {
                    console.log('article loaded successfully', result)
                    setSelectedArticle(result)
                    setShowArticle(true)
                }).catch((error) => {
                    console.error(error)
                    setIpfsErrorMsg(error.toString())
                })
        }
    
        // eslint-disable-next-line
    }, [selectedArticleName])


    const label = 'files'
    return (
    <main>

        {/* error messages */}

        <Alert variant='danger' show={ipfsErrorMsg !== ''} onClose={() => setIpfsErrorMsg('')} dismissible>
            <Alert.Heading>IPFS Error</Alert.Heading>
            <p className='alert-text'>{ipfsErrorMsg}</p>
        </Alert>
        <Alert variant='danger' show={localErrorMsg !== ''} onClose={() => setLocalErrorMsg('')} dismissible>
            <Alert.Heading>Error loading drafts</Alert.Heading>
            <p className='alert-text'>{localErrorMsg}</p>
        </Alert>

        {/* article reader modal */}

        <ArticleReaderModal 
            show={showArticle} 
            closeArticle={closeArticle} 
            onExited={cleanUpArticle}
            modalTitle={selectedArticleName} 
            article={selectedArticle} 
            />

        {/* list published ipfs files */}

        <div className='content'>
            <p className='inline-header'><strong>published :: </strong>{publishedDocs.length} {label}</p>
            <Container>
                {publishedDocs.length === 0 && <p><b>no files found</b></p>}
                {loading && <Spinner />}
                { 
                    publishedDocs.map((doc, index) => { return (
                    <Row key={index}>
                        <Col>
                            <Send size={19} className='published-file-send-icon' onClick={() => notifyWire(doc)} />
                            &nbsp;
                            <a href={doc} className='file-link' onClick={(e) => openArticle(e, doc)}>{doc}</a>
                        </Col>
                    </Row>)}) 
                }
            </Container>

            {/* list local drafts */}

            <p className='inline-header mt-4'><strong>drafts :: </strong>{drafts.length} {label}</p>
            <Container>
                {drafts.length === 0 && <p><b>no files found</b></p>}
                {   drafts.map((draft, index) => {
                        return (
                            <Row key={index}>
                                <Col>
                                    <PencilSquare className='align-text-bottom' size={19} />
                                    &nbsp;
                                    <Link className='file-link' to='/edit' state={{open: draft}}>{draft}</Link>
                                </Col>
                            </Row>
                        )
                    })
                }
            </Container>
        </div>
    </main>
    );
}