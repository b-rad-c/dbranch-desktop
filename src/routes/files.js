import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Alert, Modal, Button, Form } from 'react-bootstrap'
import { PencilSquare, Send } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';
import { create } from 'ipfs-http-client'
import { ArticleReaderModal, loadArticleFromIPFS } from 'dbranch-core'


export default function FilesPage(props) {

    //
    // globals
    //

    const [ipfsErrorMsg, setIpfsErrorMsg] = useState('')
    const [localErrorMsg, setLocalErrorMsg] = useState('')

    const settings = props.settings
    const getPublishedPath = (filename) => window.dBranch.joinPath(props.settings.dBranchPublishedDir, filename)


    //
    // load file listings (run automatically on first render)
    //

    const [loading, setLoading] = useState(true)
    const [drafts, setDrafts] = useState([])
    const [publishedDocs, setPublishedDocs] = useState([])

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

    const [selectedArticleName, setSelectedArticleName] = useState(null)
    const [selectedArticle, setSelectedArticle] = useState(null)
    const [showArticle, setShowArticle] = useState(false)

    const openArticle = (e, name) => { setSelectedArticleName(name); e.preventDefault() }
    const closeArticle = () => { setShowArticle(false) }
    const cleanUpArticle = () => { setSelectedArticleName(null); setSelectedArticle(null) }

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

    //
    // publish article to news wire
    //

    const [showNotifyWireModal, setShowNotifyWireModal] = useState(false)
    const [articleNameForWire, setArticleNameForWire] = useState(null)
    const [transactionIdForWire, setTransactionIdForWire] = useState('')

    const openNotificationModal = (name) => { setArticleNameForWire(name); setShowNotifyWireModal(true) }
    const closeNotifyWireModal = () => { setShowNotifyWireModal(false) }
    const cleanUpNotifyWireModal = () => { setArticleNameForWire(null) }

    const notifyWire = () => {
        const localPath = getPublishedPath(articleNameForWire)
        const client = create(settings.ipfsHost)

        client.files.stat(localPath)
            .then((stat) => {
                const payload = {name: articleNameForWire, cid: stat.cid.toString()}
                if (transactionIdForWire) {
                    payload.transaction_id = transactionIdForWire
                }
                console.log(payload)
                client.pubsub.publish(settings.wireChannel, JSON.stringify(payload))
            }).catch((error) => {
                console.error(error)
                setIpfsErrorMsg(error.toString())
            })
    }

    
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
        
        {/* notify wire modal */}
        <Modal size='lg' show={showNotifyWireModal} onHide={closeNotifyWireModal} onExited={cleanUpNotifyWireModal}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm wire notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col sm='3'><strong>wire channel :: </strong></Col><Col>{settings.wireChannel}</Col>
                    </Row>
                    <Row>
                        <Col sm='3'><strong>article name :: </strong></Col><Col>{articleNameForWire}</Col>
                    </Row>
                    
                    <Form.Group as={Row} controlId="transaction-id">
                        <Form.Label  sm='3' column><strong>transaction&nbsp;&nbsp;::&nbsp;</strong></Form.Label>
                        <Col>
                            <Form.Control 
                                type='text' 
                                className='text-start'
                                placeholder='optional cardano transaction id' 
                                value={transactionIdForWire} 
                                onChange={(e) => setTransactionIdForWire(e.target.value)}
                                />
                        </Col>
                    </Form.Group>
                </Form>
                    
                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="warning" onClick={closeNotifyWireModal}>Cancel</Button>
                <Button variant="success" onClick={notifyWire} >Confirm</Button>
            </Modal.Footer>
        </Modal>

        {/* list published ipfs files */}

        <div className='content'>
            <p className='inline-header'><strong>published :: </strong>{publishedDocs.length} files</p>
            <Container>
                {publishedDocs.length === 0 && <p><b>no files found</b></p>}
                {loading && <Spinner />}
                { 
                    publishedDocs.map((doc, index) => { return (
                    <Row key={index}>
                        <Col>
                            <Send size={19} className='published-file-send-icon' onClick={() => openNotificationModal(doc)} />
                            &nbsp;
                            <a href={doc} className='file-link' onClick={(e) => openArticle(e, doc)}>{doc}</a>
                        </Col>
                    </Row>)}) 
                }
            </Container>

            {/* list local drafts */}

            <p className='inline-header mt-4'><strong>drafts :: </strong>{drafts.length} files</p>
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