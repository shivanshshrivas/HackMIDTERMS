"use client";

import React, { useState } from 'react';
import '@/app/globals.css';

export default function Flashcard(props) {
    const [flipped, setFlipped] = useState(false);

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    return (
        <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="flashcard-inner">
                <div className="flashcard-front">
                    <b>Question: </b>
                    <br />
                    {props.question}
                </div>
                <div className="flashcard-back">
                    <b>Answer: </b>
                    <br />
                    {props.answer}
                </div>
            </div>
        </div>
    );
};