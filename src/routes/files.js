import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { PencilSquare } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';
import { create } from 'ipfs-http-client'

const ipfsClient = create('http://127.0.0.1:5001')

async function loader() {
    for await (const x of ipfsClient.files.ls('/dBranch/published')) {
        console.log(x);
    }
}

loader()


export default function FilesPage(props) {
    const settings = props.settings
    const [loading, setLoading] = useState(true)
    const [drafts, setDrafts] = useState([])
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        const ipfsClient = create(settings.ipfsHost)
        console.log(ipfsClient.files.ls(settings.dBranchPublishedDir))

        /*(async () => {
            for await (const x of ipfsClient.files.ls(settings.dBranchPublishedDir)) {
                console.log(x);
            }
        })();*/

    // eslint-disable-next-line
    }, [])

    useEffect(() => {
        console.log('listing user documents')
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
            <p className='inline-header'><strong>published :: </strong>0 {label}</p>
        </div>
        <div className='content'>
            <p className='inline-header'><strong>drafts :: </strong>{drafts.length} {label}</p>
            {drafts.length === 0 &&<span>no files found</span>}
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