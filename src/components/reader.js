import { Modal } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { create } from 'ipfs-http-client'
import { Article } from 'dbranch-core'


export default function ReaderModal(props) {
    
    const [loading, setLoading] = useState(true)
    const [article, setArticle] = useState(null)

    async function loadIPFSFile(path) {
        console.log('loading from ipfs: ' + path)
        const ipfsClient = create(props.settings.ipfsHost)
        
        let result = ''
        let utf8decoder = new TextDecoder();
        for await (const chunk of ipfsClient.files.read(path)) {
            result += utf8decoder.decode(chunk)
        }
        return result
    }

    useEffect(() => {
        if(props.show) {
            loadIPFSFile(props.settings.dBranchPublishedDir + '/' + props.loadArticle)
                .then((result) => {
                    console.log(result)
                    setArticle(result)
                }).catch((error) => {
                    console.error(error)
                }).finally(() => setLoading(false))
            
            
        }
    // eslint-disable-next-line
    }, [props.show])
    
    return (
        <Modal show={props.show} onHide={props.closeArticle} dialogClassName='reader-modal'>
            
            <Modal.Body>
            {loading && <Spinner />}
            <p>
                {article}
            </p>
            </Modal.Body>
      </Modal>
    )
}