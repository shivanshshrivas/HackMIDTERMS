"use client";

import React, { useState } from 'react';
import '@/app/globals.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
require('dotenv').config();

export default function Flashcard(props) {
    const [flipped, setFlipped] = useState(false);
    const router = useRouter();

    const handleFlip = () => {
        setFlipped(!flipped);
    };
    const [deleted, setDeleted] = useState(false);
    const handleDelete = async (cid) => {
        const options = {
            method: 'DELETE',
            url: `https://api.pinata.cloud/pinning/unpin/${cid}`,
            headers: {
                pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
                pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
                'Content-Type': 'application/json'
            },
        };
    
        try {
            const response = await axios(options);
            setDeleted(true);
        }
        catch (error) {
            console.error("Error deleting flashcard:", error);
        }
    };
    

    return (
        <div className={deleted ? 'flashcard-deleted' : `flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="flashcard-inner">
                <div className="flashcard-front">
                    <b>Question: </b>
                    <br />
                    {props.question}
                    <div className = 'page-button' style={{'zIndex':'99'}}>
                    {!props.isNew && <button style = {{'backgroundColor': deleted ? 'red': ''}}onClick={(e) => { e.stopPropagation(); handleDelete(props.cid); }}>{deleted ? 'Deleted' :'Delete'}</button>}
                </div>
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