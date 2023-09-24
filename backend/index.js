const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const readline = require('readline');
const PORT = 3001; // May need to change PORT to something else if 3000 is already in use

app.use(cors());

let score = 0;
let correctWord = "";


app.get('/hello', (req, res) => {
    res.send('hello world!');
}); 

app.get('/score', (req, res) => {
    res.send(`${score}`);
});

app.patch('/score', (req, res) => {
    score += parseInt(req.query.val);
    res.status(200).send(`${score}`);
})

app.patch('/startOver', (req, res) => {
    score = 0;
    res.status(200).send(`${score}`);
});

app.get('/getWord', async (req, res) => {
    // check if the "mode" query parameter is provided, default to easy if not specified
    const mode = req.query.mode || "easy";

    const wordLength = mode === "easy" ? 5 : 8;

    // fetches random word from random-word-api of length, wordLength
    let word = await fetch(`https://random-word-api.herokuapp.com/word?length=${wordLength}`).then((res) => res.json());
    word = word[0];
    correctWord = word;
    // Scamble the word
    const scrambledWord = scrambleWord(word);
    console.log(scrambledWord, correctWord);
    return res.status(200).send(scrambledWord);
});

function scrambleWord(word) {
    const wordArray = word.split('');
    for (let i = wordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]]; // Swap characters
    }
    return wordArray.join('');
}


app.get('/getRandom', (req, res) => {
    res.send()
}) 
app.patch('/guessWord', (req, res) => {
    console.log(req.query.word);
    if(req.query?.word === correctWord) {
        score += 1;
        res.status(200).send({isCorrect: true, score: score});
    } else {
        res.status(200).send('false');
    }
})

app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});