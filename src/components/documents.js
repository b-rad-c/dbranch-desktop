import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { PencilSquare, Send, BoxArrowUpRight } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';
import { create } from 'ipfs-http-client'
import { ArticleReaderModal, loadArticleFromIPFS, CardanoExplorerLink } from 'dbranch-core'
import { ipfsDownloadURL } from '../constants'
import { ExternalURL } from '../utilities/misc'


export default function DocumentListings(props) {

    //
    // state variables
    //

    const settings = props.settings
    const publishedDir = settings.dBranchPublishedDir
    const curatedDir = settings.dBranchCuratedDir

    const [loading, setLoading] = useState(true)
    const [drafts, setDrafts] = useState([])
    const [publishedDocs, setPublishedDocs] = useState([])
    const [curatedDocs, setCuratedDocs] = useState([])
    const [ipfsErrorMsg, setIpfsErrorMsg] = useState('')
    const [localErrorMsg, setLocalErrorMsg] = useState('')

    const [articleToPreviewPath, setArticleToPreviewPath] = useState(null)
    const [articleToPreview, setArticleToPreview] = useState(null)
    const [showArticlePreview, setShowArticlePreview] = useState(false)
    const [cardanoExplorerUrl, setCardanoExplorerUrl] = useState('')

    const getPublishedPath = (filename) => window.dBranch.joinPath(props.settings.dBranchPublishedDir, filename)


    //
    // load file listings (run automatically on first render)
    //

    async function loadIPFSDocs(directory) {
        const names = []
        const ipfsClient = create(settings.ipfsHost)
        for await (const f of ipfsClient.files.ls(directory)) {
            names.push(f.name)
        }
        return names
    }

    // load published then curated docs
    useEffect(() => {
        loadIPFSDocs(publishedDir)
            .then((published_docs) => {
                setPublishedDocs(published_docs.filter(name => name.endsWith('.news')))

                loadIPFSDocs(curatedDir)
                    .then((curated_docs) => {
                        setCuratedDocs(curated_docs.filter(name => name.endsWith('.news')))
                    })

            }).catch((error) => {
                console.error(error) 
                setIpfsErrorMsg(error.toString())
            }).finally(() => setLoading(false))
    // eslint-disable-next-line
    }, [])

    // load drafts stored on local machine
    useEffect(() => {
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

    const openArticle = (e, path) => { setArticleToPreviewPath(path); e.preventDefault() }
    const closeArticle = () => { setShowArticlePreview(false) }
    const cleanUpArticle = () => { setArticleToPreviewPath(null); setArticleToPreview(null) }

    useEffect(() => {
        if(articleToPreviewPath !== null) {
            console.log('loading from ipfs: ' + articleToPreviewPath)
            loadArticleFromIPFS(create(props.settings.ipfsHost), articleToPreviewPath, true)
                .then((result) => {
                    console.log('article loaded successfully', result)
                    setArticleToPreview(result)
                    setShowArticlePreview(true)
                    setCardanoExplorerUrl(CardanoExplorerLink(result.record.cardano_tx_hash))
                }).catch((error) => {
                    console.error(error)
                    setIpfsErrorMsg(error.toString())
                })
        }
    
        // eslint-disable-next-line
    }, [articleToPreviewPath])

    //
    // wire
    //

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


    const label = 'files'
    return (
    <div>

        {/* error messages */}

        <Alert variant='danger' show={ipfsErrorMsg !== ''} onClose={() => setIpfsErrorMsg('')} dismissible>
            <Alert.Heading>IPFS Error</Alert.Heading>
            <p className='alert-text'>{ipfsErrorMsg} - if you don't have IPFS installed, you can download it from <ExternalURL url={ipfsDownloadURL}>this link</ExternalURL>.</p>
        </Alert>
        <Alert variant='danger' show={localErrorMsg !== ''} onClose={() => setLocalErrorMsg('')} dismissible>
            <Alert.Heading>Error loading drafts</Alert.Heading>
            <p className='alert-text'>{localErrorMsg}</p>
        </Alert>

        {/* article reader modal */}

        <ArticleReaderModal 
            show={showArticlePreview} 
            closeArticle={closeArticle} 
            onExited={cleanUpArticle}
            modalTitle={articleToPreviewPath} 
            article={articleToPreview} 
            >   

            <span>
                <ExternalURL url={cardanoExplorerUrl}>view on explorer</ExternalURL> <BoxArrowUpRight size={12}/>
            </span>
            

        </ArticleReaderModal>

        <div className='content'>

            {/* list published ipfs files */}

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
                            <a href={doc} className='file-link' onClick={(e) => openArticle(e, publishedDir + '/' + doc)}>{doc}</a>
                        </Col>
                    </Row>)}) 
                }
            </Container>

            {/* list curated ipfs files */}

            <p className='inline-header'><strong>curated :: </strong>{curatedDocs.length} {label}</p>
            <Container>
                {curatedDocs.length === 0 && <p><b>no files found</b></p>}
                {loading && <Spinner />}
                { 
                    curatedDocs.map((doc, index) => { return (
                    <Row key={index}>
                        <Col>
                            <a href={doc} className='file-link' onClick={(e) => openArticle(e, curatedDir + '/' + doc)}>{doc}</a>
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
    </div>
    );
}