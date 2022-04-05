import { useState } from 'react'
import { Button, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap'
import { testIPFSConnection } from 'dbranch-core'
import { create } from 'ipfs-http-client'

export default function SettingsPage(props) {

    //
    // inputs & state
    //

    const settings = props.settings
    const updateSetting = props.updateSetting
    const ipfsHostHandler = (e) => updateSetting('ipfsHost', e.target.value)
    const wireChannelHandler = (e) => updateSetting('wireChannel', e.target.value)

    const defaultTestResult = {title: null, msg: null, variant: null}
    const [ testResult, setTestResult ] = useState(defaultTestResult)

    //
    // actions
    //

    const pingIPFS = () => { 
        testIPFSConnection(settings.ipfsHost)
            .then((response) => {
                setTestResult({title: 'Testing IPFS connection', msg: 'version: ' + response.version, variant: 'success'})
            }).catch((error) => {
                setTestResult({title: 'Testing IPFS connection', msg: error.toString() + ' check console for more info...', variant: 'danger'})
                console.error(error)
            }).finally(() => setTimeout(() => setTestResult(defaultTestResult), 3000))
    }

    const pingWire = () => { 
        const ipfsClient = create(settings.ipfsHost)
        ipfsClient.pubsub.publish(settings.wireChannel, 'ping')
            .then((response) => {
                setTestResult({title: 'Testing wire', msg: 'published ping to wire channel: ' + settings.wireChannel, variant: 'success'})
            }).catch((error) => {
                setTestResult({title: 'Testing wire', msg: error.toString() + ' check console for more info...', variant: 'danger'})
                console.error(error)
            }).finally(() => setTimeout(() => setTestResult(defaultTestResult), 3000))
    }

    return (
    <main>
        <Alert variant={testResult.variant} show={testResult.msg} transition={false}>
            <Alert.Heading>{testResult.title}</Alert.Heading>
            <p className='alert-text'>{testResult?.msg}</p>
        </Alert>
        
        <Form className='content'>
            {
                /* ipfs host */
            }
            <Form.Group as={Row}  className='mb-3' controlId='input-ipfs-host'>
                <Col sm={2}>
                    <Form.Label column>IPFS Host :: </Form.Label>
                </Col>
                
                <Col>
                    <InputGroup>
                        <Button variant='secondary' onClick={pingIPFS}>Test</Button>
                        <Form.Control type='string' value={settings.ipfsHost} onChange={ipfsHostHandler} />
                    </InputGroup>
                </Col>
            </Form.Group>

            {
                /* publish wire */
            }
            <Form.Group as={Row} className='mb-3' controlId='wirte-channel'>
                <Col sm={2}>
                    <Form.Label column>wire :: </Form.Label>
                </Col>
                
                <Col>
                    <InputGroup>
                        <Button variant='secondary' onClick={pingWire}>Test</Button>
                        <Form.Control type='string' value={settings.wireChannel} onChange={wireChannelHandler} />
                    </InputGroup>
                </Col>
            </Form.Group>
            <Button variant='primary' onClick={props.resetSettings}>Reset</Button>
        </Form>
    </main>
    );
}