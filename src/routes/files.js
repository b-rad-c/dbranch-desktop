import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { PencilSquare } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';
import { create } from 'ipfs-http-client'








export default function FilesPage(props) {
    const settings = props.settings
    const [loading, setLoading] = useState(true)
    const [drafts, setDrafts] = useState([])
    const [publishedDocs, setPublishedDocs] = useState([])
    const [errorMsg, setErrorMsg] = useState('')

    async function loadIPFSDocs() {
        console.log('listing published documents...')
        const names = []
        const ipfsClient = create(settings.ipfsHost)
        for await (const f of ipfsClient.files.ls('/dBranch/published')) {
            names.push(f.name)
        }
        return names
    }

    useEffect(() => {
        loadIPFSDocs()
            .then((result) => {
                console.log('ipfs files', result)
                setPublishedDocs(result)
            })
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
                setErrorMsg(error.toString())
            }).finally(() => setLoading(false))
    }, [])


    const label = 'files'
    return (
    <main>
        <Alert variant='danger' show={errorMsg !== ''} dismissible>
            <Alert.Heading>Error</Alert.Heading>
            <p className='alert-text'>{errorMsg}</p>
        </Alert>
        <div className='content'>
            <p className='inline-header'><strong>published :: </strong>{publishedDocs.length} {label}</p>
            {publishedDocs.length === 0 &&<p>no files found</p>}
            {loading && <Spinner />}
            <Container>
                {   publishedDocs.map((publishedDoc, index) => {
                        return (
                            <Row key={index}>
                                <Col>
                                    {publishedDoc}
                                </Col>
                            </Row>
                        )
                    })
                }
            </Container>
        </div>
        <div className='content'>
            <p className='inline-header'><strong>drafts :: </strong>{drafts.length} {label}</p>
            {drafts.length === 0 &&<p>no files found</p>}
            {loading && <Spinner />}
            <Container>
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