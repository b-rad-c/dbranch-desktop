import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { PencilSquare } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';
import { create } from 'ipfs-http-client'
import ReaderModal from '../components/reader';


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
    const [showReader, setShowReader] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    const openArticle = (e, name) => {
        setSelectedArticle(name)
        setShowReader(true)
        e.preventDefault()
    }

    const closeArticle = () => {
        setSelectedArticle(null)
        setShowReader(false)
    }


    async function loadIPFSDocs() {
        console.log('listing published documents...')
        const names = []
        const ipfsClient = create(settings.ipfsHost)
        for await (const f of ipfsClient.files.ls(settings.dBranchPublishedDir)) {
            names.push(f.name)
        }
        return names
    }

    //
    // load file data
    //

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


    const label = 'files'
    return (
    <main>
        <Alert variant='danger' show={ipfsErrorMsg !== ''} onClose={() => setIpfsErrorMsg('')} dismissible>
            <Alert.Heading>Error loading published files</Alert.Heading>
            <p className='alert-text'>{ipfsErrorMsg}</p>
        </Alert>
        <Alert variant='danger' show={localErrorMsg !== ''} onClose={() => setLocalErrorMsg('')} dismissible>
            <Alert.Heading>Error loading drafts</Alert.Heading>
            <p className='alert-text'>{localErrorMsg}</p>
        </Alert>
        <ReaderModal show={showReader} closeArticle={closeArticle} loadArticle={selectedArticle} settings={settings} />
        <div className='content'>
            <p className='inline-header'><strong>published :: </strong>{publishedDocs.length} {label}</p>
            <Container>
                {publishedDocs.length === 0 && <p><b>no files found</b></p>}
                {loading && <Spinner />}
                { 
                    publishedDocs.map((doc, index) => { return (<Row key={index}><Col>
                        <a href={doc} className='file-link' onClick={(e) => openArticle(e, doc)}>{doc}</a>
                    </Col></Row>)}) 
                }
            </Container>

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