import { useState, useEffect } from 'react'
import { Alert, Form, Row, Col, InputGroup, Button, Spinner } from 'react-bootstrap'
import { ArrowClockwise, Check2Circle } from 'react-bootstrap-icons'
import { dBranchAPI, ArticleIndex, ArticleReader  } from 'dbranch-core'


export default function BrowsePage(props) {

    const [ networkHost, setNetworkHost ] = useState(props.settings.defaultNetworkHost)
    const updateNetworkHost = (e) => setNetworkHost(e.target.value)

    const [showError, setShowError] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [loading, setLoading ] = useState(true)
    const [loadSuccess, setLoadSuccess ] = useState(false)

    const [articleIndex, setArticleIndex] = useState(null)
    const [articleName, setArticleName] = useState(null)    // article to load
    const [article, setArticle] = useState(null)            // loaded article
    const showArticleIndex = articleIndex !== null && article === null

    const loadArticleIndex = () => setLoading(true)
    const loadToArticle = (record) => setArticleName(record.name)
    const closeArticle = () => { setArticleName(null); setArticle(null) }

    useEffect(() => { 
        if (loading) {
            console.log('loading index from: ' + networkHost)
            /*

                in the future this article index should use IPNS to point to the CID of the index file rather than use the backend api
                which is for the web page. This should be coupled with forming an adhoc swarm with the host to ensure quick delivery of the index.

            */
            const api = new dBranchAPI(networkHost)
            api.getArticleIndex()
                .then((index) => {
                    console.log('loaded index', index)
                    setArticleIndex(index)
                    setLoadSuccess(true)
                    setTimeout(() => setLoadSuccess(false), 1500)
                }).catch((error) => {
                    console.log(error)
                    setErrMsg('Error loading articles, refresh browser to try again.')
                    setShowError(true)
                }).finally(() => {
                    setLoading(false)
                })
        }
    }, [loading]);

    useEffect(() => {
        if (articleName !== null) {
            console.log('loading article: ' + articleName)
            const api = new dBranchAPI(networkHost)
            api.getArticle(articleName)
                .then((article) => {
                    console.log('loaded article', article)
                    setArticle(article)
                }).catch((error) => {
                    console.log(error)
                    setErrMsg('Error loading article, please try again.')
                    setShowError(true)
                }).finally(() => {
                    setLoading(false)
                })
        }
    }, [articleName])

return (
<main>

    <Alert variant='danger' show={showError} onClose={() => setShowError(false)}>
        <Alert.Heading>We've got a problem</Alert.Heading>
        <p>{errMsg}</p>
    </Alert>

    <div className='content'>

        {/* network address bar */}

        <Row>
            <Col className='text-end' lg='2'><p className='inline-header'><strong>network :: </strong></p></Col>
            <Col>
                <InputGroup className='mb-3'>
                    <Button variant='secondary'>
                        {loadSuccess && <Check2Circle size={20} />}
                        {!loadSuccess && <ArrowClockwise size={20} onClick={loadArticleIndex} />}
                    </Button>
                    <Form.Control size='md' type='text' value={networkHost} onChange={updateNetworkHost} />
                </InputGroup>
            </Col>
        </Row>

        {/* article index */}

        {loading && <div className='text-center'><Spinner animation='border' /></div>}
        {showArticleIndex && <ArticleIndex gap={2} theme='bubble' onItemClick={loadToArticle} index={articleIndex}/>}

        {/* display article */}
        {article &&
            <div>

                <Button variant='secondary' onClick={closeArticle}>close</Button>

                <ArticleReader article={article}>
                    { /*<span><ExternalLink url={explorerURL}>view on explorer</ExternalLink> <BoxArrowUpRight size={12}/></span>*/ }
                </ArticleReader>
            
            </div>
        }

    </div>
</main>
);
}