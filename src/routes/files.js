import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import { PencilSquare } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';


export default function FilesPage(props) {
    const [loading, setLoading] = useState(true)
    const [ drafts, setDrafts ] = useState([])

    useEffect(() => {
        console.log('listing user documents')
        window.dBranch.listUserDocuments()
            .then((result) => {
                const docs = result.filter((name) => !name.startsWith('.') )
                console.log('user docs:', docs)
                setDrafts(docs)
            }).catch((error) => {
                console.error(error)
            }).finally(() => setLoading(false))
    }, [])


    const label = 'files'
    return (
    <main>
        <div className='content'>
            <p className='inline-header'><strong>published :: </strong>0 {label}</p>
        </div>
        <div className='content'>
            <p className='inline-header'><strong>draft :: </strong>{drafts.length} {label}</p>
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