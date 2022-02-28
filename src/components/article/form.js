import { Form, FormControl, FloatingLabel, InputGroup, Button } from 'react-bootstrap';
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

//
// components
//

export function ArticleHeaderForm(props) {
    const titleHandler = (e) => { props.setTitle(e.target.value)}
    const randomTitle = () => props.setTitle(generateTitle)
    const subTitleHandler = (e) => { props.setSubTitle(e.target.value)}
    const randomSubTitle = () => props.setSubTitle(generateSubTitle)

    return (
    <Form className='alt-content' style={{width: '70%'}}>
        <InputGroup className="mb-3">
            <Button variant="secondary" id="button-addon1" onClick={randomTitle}>Random</Button>
            <FormControl type='string' placeholder='Enter title...' value={props.title} onChange={titleHandler} />
        </InputGroup>

        <InputGroup className="mb-3">
            <Button variant="secondary" id="button-addon1" onClick={randomSubTitle}>Random</Button>
            <FormControl as='textarea' placeholder='Enter subtitle...' style={{height: '65px'}} value={props.subTitle} onChange={subTitleHandler}/>
        </InputGroup>
    </Form>
    );
}


//
// main component
//


export default function EditForm() {
    const [ title, setTitle] = useState('')
    const [ subTitle, setSubTitle] = useState('')

    return (
    <div>
        <ArticleHeaderForm title={title} setTitle={setTitle} subTitle={subTitle} setSubTitle={setSubTitle} />
    </div>
    );
}