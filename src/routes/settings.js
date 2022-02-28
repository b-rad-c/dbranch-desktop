import { useState } from 'react'
import { Button, Form, Row, Col, InputGroup, ToastContainer, Toast } from 'react-bootstrap'
import { create } from 'ipfs-http-client'

export default function SettingsPage(props) {

const settings = props.settings
const updateSetting = props.updateSetting

const ipfsHostHandler = (e) => { updateSetting('ipfsHost', e.target.value)}

const [ testResult, setTestResult ] = useState('')
const testConnection = () => { 
    const client = create(settings.ipfsHost)
    client.version()
        .then((response) => {
            setTestResult('version: ' + response.version)
        }).catch((error) => {
            setTestResult(error.toString() + ' check console for more info...')
            console.error(error)
        })
}

return (
<main>
    <h1>Settings</h1>
    <ToastContainer position="top-center">
        <Toast bg='light' show={testResult} onClose={() => setTestResult('')} delay={3000} autohide>
            <Toast.Header>
                <strong className="me-auto">IPFS</strong>
                <small>{settings.ipfsHost}</small>
            </Toast.Header>
            <Toast.Body>{testResult}</Toast.Body>
        </Toast>
    </ToastContainer>
    
    <Form className='alt-content'>
        <Form.Group as={Row} className="mb-3" controlId="input-ipfs-host">
            <Form.Label column>
                IPFS Host :: 
            </Form.Label>
            <Col sm={10}>
                <InputGroup>
                    <Button variant="secondary" onClick={testConnection}>Test</Button>
                    <Form.Control type="string" value={settings.ipfsHost} onChange={ipfsHostHandler} />
                </InputGroup>
            </Col>
        </Form.Group>
        <Button variant="primary" onClick={props.resetSettings}>Reset</Button>
    </Form>
</main>
);
}