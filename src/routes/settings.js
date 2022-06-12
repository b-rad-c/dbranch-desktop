import { useState, useEffect } from 'react'
import { Button, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap'
import { create } from 'ipfs-http-client'
import { Check2Circle } from 'react-bootstrap-icons'
import { ipfsDownloadURL } from '../constants'
import { ExternalURL } from '../utilities/misc'

export default function SettingsPage(props) {

    //
    // inputs & state
    //

    const settings = props.settings
    const updateSetting = props.updateSetting
    const ipfsHostHandler = (e) => updateSetting('ipfsHost', e.target.value)
    const wireChannelHandler = (e) => updateSetting('wireChannel', e.target.value)

    const [ ipfsPeerId, setIpfsPeerId ] = useState('')
    const [ peerIdCopied, setPeerIdCopied ] = useState(false)

    const [ ipfsPingSuccess, setIpfsPingSuccess ] = useState(false)
    const [ ipfsErrorMsg, setIpfsErrorMsg ] = useState('')

    const [ wirePingSuccess, setWirePingSuccess ] = useState(false)
    const [ wirePingErrorMsg, setWirePingErrorMsg ] = useState('')

    useEffect(() => {
        const ipfsClient = create(settings.ipfsHost)
        ipfsClient.id()
            .then((response) => {
                setIpfsPeerId(response.id)
            }).catch((error) => {
                console.error(error)
            })
    // eslint-disable-next-line
    }, [])

    //
    // actions
    //

    const pingIPFS = () => { 
        const ipfsClient = create(settings.ipfsHost)
        ipfsClient.id()
            .then((response) => {
                setIpfsPeerId(response.id)
                setIpfsPingSuccess(true)
                setTimeout(() => setIpfsPingSuccess(false), 3000)
            }).catch((error) => {
                setIpfsErrorMsg(error.toString() + ' check console for more information')
                console.error(error)
                setTimeout(() => setIpfsErrorMsg(''), 3000)
            })
    }

    const copyPeerId = () => {
        window.dBranch.copyText(ipfsPeerId)
        setPeerIdCopied(true)
        setTimeout(() => setPeerIdCopied(false), 3000)
    }

    const pingWire = () => { 
        const ipfsClient = create(settings.ipfsHost)
        ipfsClient.pubsub.publish(settings.wireChannel, 'ping')
            .then(() => {
                setWirePingSuccess(true)
                setTimeout(() => setWirePingSuccess(false), 3000)
            }).catch((error) => {
                setWirePingErrorMsg(error.toString() + ' check console for more information')
                console.error(error)
                setTimeout(() => setWirePingErrorMsg(''), 3000)
            })
    }

    const rowClass = 'mb-3 text-end'

    return (
    <main>        
        <Form className='content'>
            {
                /* ipfs host */
            }
            <Form.Group as={Row} className={rowClass} controlId='input-ipfs-host'>
                <Col sm={2}>
                    <Form.Label column>IPFS Host :: </Form.Label>
                </Col>
                
                <Col>
                    <InputGroup>
                        {ipfsPingSuccess && <Button variant='secondary'>&nbsp;<Check2Circle />&nbsp;</Button>}
                        {!ipfsPingSuccess && <Button variant='secondary' onClick={pingIPFS}>Ping</Button>}
                        <Form.Control type='string' value={settings.ipfsHost} onChange={ipfsHostHandler} />
                    </InputGroup>
                </Col>
            </Form.Group>

            <Alert variant='danger' show={ipfsErrorMsg} transition={false}>
                <Alert.Heading>Error contacting IPFS</Alert.Heading>
                <p className='alert-text'>{ipfsErrorMsg} - if you don't have IPFS installed, you can download it from <ExternalURL url={ipfsDownloadURL}>this link</ExternalURL>.</p>
            </Alert>

            {
                /* peer id (read only) */
            }
            <Form.Group as={Row} className={rowClass} controlId='peer-id'>
                <Col sm={2}>
                    <Form.Label column>IPFS Peer ID :: </Form.Label>
                </Col>
                
                <Col>
                    <InputGroup>
                        {peerIdCopied  && <Button variant='secondary'>&nbsp;<Check2Circle />&nbsp;</Button>}
                        {!peerIdCopied && <Button variant='secondary' onClick={copyPeerId} disabled={!ipfsPeerId}>Copy</Button>}
                        <Form.Control type='string' placeholder='cannot contact ipfs' value={ipfsPeerId} disabled />
                    </InputGroup>
                </Col>
            </Form.Group>

            {
                /* publish wire */
            }
            <Form.Group as={Row} className={rowClass} controlId='wire-channel'>
                <Col sm={2}>
                    <Form.Label column>wire :: </Form.Label>
                </Col>
                
                <Col>
                    <InputGroup>
                        {wirePingSuccess  && <Button variant='secondary'>&nbsp;<Check2Circle />&nbsp;</Button>}
                        {!wirePingSuccess && <Button variant='secondary' onClick={pingWire}>Ping</Button>}
                        <Form.Control type='string' value={settings.wireChannel} onChange={wireChannelHandler} />
                    </InputGroup>
                </Col>
            </Form.Group>

            <Alert variant='danger' show={wirePingErrorMsg} transition={false}>
                <Alert.Heading>Error pinging wire</Alert.Heading>
                <p className='alert-text'>{wirePingErrorMsg}</p>
            </Alert>

            <Button variant='primary' onClick={props.resetSettings}>Reset</Button>
        </Form>
    </main>
    );
}