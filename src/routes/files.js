import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { PencilSquare } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';
import { create } from 'ipfs-http-client'


export default function FilesPage(props) {

    //
    // state variables
    //

    const settings = props.settings
    const [loading, setLoading] = useState(true)
    const [drafts, setDrafts] = useState([])
    const [publishedDocs, setPublishedDocs] = useState([])
    const [errorMsg, setErrorMsg] = useState('')

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
            <Container>
                {publishedDocs.length === 0 && <p><b>no files found</b></p>}
                {loading && <Spinner />}
                { 
                    publishedDocs.map((doc, index) => { return (<Row key={index}><Col><b>{doc}</b></Col></Row>)}) 
                }
            </Container>
        </div>
        <div className='content'>
            <p className='inline-header'><strong>drafts :: </strong>{drafts.length} {label}</p>
            <Container>
                {drafts.length === 0 && <p><b>no files found</b></p>}
                {loading && <Spinner />}
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