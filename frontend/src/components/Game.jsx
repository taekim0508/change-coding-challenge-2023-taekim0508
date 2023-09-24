import React, { useState, useEffect } from 'react';
import { Input, Button, notification, Radio } from 'antd';
import axios from 'axios';

import './easy-background.css';

function Game() {
    const [word, setWord] = useState("");
    const [score, setScore] = useState(0);
    const [guess, setGuess] = useState("");
    // set default to easy
    const [gameMode, setGameMode] = useState("easy");
    // initialize 3 lives
    const [lives, setLives] = useState(3);

    const handleModeChange = (e) => {
        setGameMode(e.target.value);
    };

    // Define a CSS class for conditional background color
    const backgroundColorClass = gameMode === 'easy' ? 'easy-background' : 'hard-background';

    const handleSubmit = () => {
        if (lives <= 0) {
            return;
        }

        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: `http://localhost:3001/guessWord?word=${guess}`,
            headers: {}
        };
        axios.request(config)
            .then((response) => {
                if (response.data.isCorrect === true) {
                    setScore(response.data.score);
                    notification.success({
                        message: "Correct!",
                        description: "You were right!",
                        placement: "top",
                        duration: 3
                    });

                } else {
                    setLives(lives - 1);
                    if (lives === 1) {
                        notification.error({
                            message: "Game Over!",
                            description: "You've run out of lives!",
                            placement: "top",
                            duration: 3
                        });
                        response.data.score = 0

                    } else {
                        notification.error({
                            message: "Incorrect!",
                            description: `You were wrong! ${lives - 1} lives remaining.`,
                            placement: "top",
                            duration: 3
                        });
                    }
                }
                setGuess("");
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchNewWord = () => {
        if (lives <= 0) {
            return;
        }
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://localhost:3001/getWord?mode=${gameMode}`,
            headers: {}
        };
        axios.request(config)
            .then((response) => {
                setWord(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        // Fetch the initial word when the component mounts
        fetchNewWord();
    }, [score, gameMode]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleStartOver = () => {
        axios.patch('http://localhost:3001/startOver')
            .then((response) => {
                // reset the game state (score, lives, word, and guess)
                setScore(0);
                setLives(3);
                setWord("");
                setGuess("");
                fetchNewWord();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className={`Card ${backgroundColorClass}`}>
            <h2> Current Word: {word} </h2>
            <Input
                style={{ width: '600px', height: '40px', fontSize: '16px' }}
                placeholder="Enter your guess"
                onChange={(input) => { setGuess(input.target.value); }}
                value={guess}
                onKeyDown={handleKeyPress}
            />
            <br /><br />
            <Button type="primary" size="large" onClick={handleSubmit}> Enter </Button>
            <Button type="default" size="large" onClick={handleStartOver}> Start Over </Button>
            <p> Score: {score} </p>
            <p> Lives: {lives} </p>

            <Radio.Group onChange={handleModeChange} value={gameMode}>
                <Radio.Button value="easy"> Easy Mode </Radio.Button>
                <Radio.Button value="hard"> Hard Mode </Radio.Button>
            </Radio.Group>
        </div>
    );
}

export default Game;