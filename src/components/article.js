import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import { useState } from 'react';
import { loremIpsum } from 'lorem-ipsum';

//
// generators
//

function generateTitle() {
    const words = loremIpsum({
        sentenceLowerBound: 3,
        sentenceUpperBound: 7,
        suffix: '',
        units: 'sentences'
      }).replace('.', '').split(' ')
    for (var i = 0; i < words.length; i++) {
        if(words[i].length < 4) continue
        words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    }
    return words.join(' ');
}

function generateSubTitle() {
    return loremIpsum({
        sentenceLowerBound: 7,
        sentenceUpperBound: 15,
        suffix: '',
        units: 'sentences'
      }).replace('.', '')
}

function generateAuthor() {
    const author = loremIpsum({
        count: 2,
        suffix: '',
        units: 'words'
      })
    return author[0].toUpperCase() + author.substring(1);
}

//
// article header
//

export function ArticleHeader(props) {
    const [ editing, setEditing] = useState(props.editOnOpen && props.canEdit ? true : false)
    const flipEditing = () => setEditing(!editing)
    const headingClickHandler = () => { if(!editing) flipEditing() }
    const headerClass = (!editing && props.canEdit) ? 'article-header article-header-can-edit' : 'article-header'
    return (
        <div className={headerClass} onClick={headingClickHandler}>
            {editing && <ArticleHeaderForm header={props.header}/>}
            {editing && <Button onClick={flipEditing}>Done</Button>}
            {!editing && <ArticleHeaderViewer header={props.header}/>}
        </div>
    );
}

export function ArticleHeaderViewer(props) {
    const header = props.header
    return (
        <div className='article-header-viewer'>
            <h1 className='article-title'>{header.title}</h1>
            <h2 className='article-subtitle'>{header.subTitle}</h2>
            <p className='article-by-line'>
                <span className='article-by-line-label'>Author :: </span>
                <span className='article-by-line-name'>{header.author}</span>
            </p>
        </div>
    );
}

export function ArticleHeaderForm(props) {
    const header = props.header
    const titleHandler = (e) => { header.setTitle(e.target.value)}
    const randomTitle = () => header.setTitle(generateTitle)

    const subTitleHandler = (e) => { header.setSubTitle(e.target.value)}
    const randomSubTitle = () => header.setSubTitle(generateSubTitle)

    const authorHandler = (e) => { header.setAuthor(e.target.value)}
    const randomAuthor = () => header.setAuthor(generateAuthor())

    return (
    <Form className='article-header-form' style={{width: '70%'}}>
        <InputGroup className="mb-3">
            <Button variant="secondary" id="button-addon1" onClick={randomTitle}>Random</Button>
            <FormControl type='string' placeholder='Enter title...' value={header.title} onChange={titleHandler} />
        </InputGroup>

        <InputGroup className="mb-3">
            <Button variant="secondary" id="button-addon1" onClick={randomSubTitle}>Random</Button>
            <FormControl as='textarea' placeholder='Enter subtitle...' style={{height: '65px'}} value={header.subTitle} onChange={subTitleHandler}/>
        </InputGroup>

        <InputGroup className="mb-3">
            <Button variant="secondary" id="button-addon1" onClick={randomAuthor}>Random</Button>
            <FormControl type='string' placeholder='Enter title...' value={header.author} onChange={authorHandler} />
        </InputGroup>
    </Form>
    );
}


//
// article
//

export default function Article() {
    const [ title, setTitle] = useState('Untitled')
    const [ subTitle, setSubTitle] = useState('Enter subtitle here')
    const [ author, setAuthor] = useState('Firstname Lastname')
    const header = {title, setTitle, subTitle, setSubTitle, author, setAuthor}

    return (
        <div>
            <ArticleForm canEdit={true} editOnOpen={true} header={header} />
        </div>
        );
}


export function ArticleForm(props) {
    
    return (
    <div>
        <ArticleHeader canEdit={props.canEdit} editOnOpen={props.editOnOpen} header={props.header} />
    </div>
    );
}