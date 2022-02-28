import { useState } from 'react'
import { Button, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap'
import { create } from 'ipfs-http-client'

export default function SettingsPage(props) {

    const settings = props.settings
    const updateSetting = props.updateSetting

    const ipfsHostHandler = (e) => { updateSetting('ipfsHost', e.target.value)}

    const defaultTestResult = {msg: null, variant: null}
    const [ testResult, setTestResult ] = useState(defaultTestResult)

    const testIPFSConnection = () => { 
        const client = create(settings.ipfsHost)
        client.version()
            .then((response) => {
                setTestResult({msg: 'version: ' + response.version, variant: 'success'})
            }).catch((error) => {
                setTestResult({msg: error.toString() + ' check console for more info...', variant: 'danger'})
                console.error(error)
            }).finally(() => setTimeout(() => setTestResult(defaultTestResult), 3000))
    }

    return (
    <main>
        <Alert variant={testResult.variant} show={testResult.msg} dismissible>
            <Alert.Heading>Testing IPFS connection</Alert.Heading>
            <p className='alert-text'>host: {settings.ipfsHost}<br />result: {testResult.msg}</p>
        </Alert>
        <h1>Settings</h1>
        
        <Form className='alt-content' style={{width: '70%'}}>
            <Form.Group as={Row} controlId='input-ipfs-host'>
                <Col sm={2}>
                    <Form.Label column>IPFS Host :: </Form.Label>
                </Col>
                
                <Col>
                    <InputGroup>
                        <Button variant='secondary' onClick={testIPFSConnection}>Test</Button>
                        <Form.Control type='string' value={settings.ipfsHost} onChange={ipfsHostHandler} />
                    </InputGroup>
                </Col>
            </Form.Group>
            <Button variant='primary' onClick={props.resetSettings}>Reset</Button>
        </Form>
    </main>
    );
}