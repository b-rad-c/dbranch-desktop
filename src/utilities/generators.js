import { loremIpsum } from 'lorem-ipsum';

//
// generators
//

const firstNames = ['Ashley', 'John', 'Jane', 'Brad', 'Chris', 'Laura', 'Megan', 'Fred', 'Alice', 'Bob', 'Samantha']
const lastNames = ['Johnson', 'Doe', 'Smith', 'Peterson', 'Fridman', 'Stewart', 'Thompson']

function randomInteger(min, max) { 
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
 }
function randomChoice(list) { return list[randomInteger(0, list.length)] }


export function randomName() {
    return randomChoice(firstNames) + ' ' + randomChoice(lastNames)
}

export function randomArticleTitle() {
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

export function randomArticleSubTitle() {
    return loremIpsum({
        sentenceLowerBound: 7,
        sentenceUpperBound: 15,
        suffix: '',
        units: 'sentences'
      }).replace('.', '')
}


export function randomArticleBody() {
    return loremIpsum({
        count: 1,
        paragraphLowerBound: 3,
        paragraphUpperBound: 7,
        sentenceLowerBound: 5,
        sentenceUpperBound: 15,
        units: 'paragraphs',
      })
}