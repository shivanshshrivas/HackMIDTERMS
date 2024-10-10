'use client';
import React ,  {useState} from 'react';
import axios from 'axios';
import {auth ,db} from '../firebase';
import {doc, getDoc} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import PageButton from '@/components/PageButton';
import Flashcard from '@/components/Flashcard';
require('dotenv').config();

const pinata_api_key = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const pinata_secret_api_key = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

export default function VideoPlayer() {
    const [quizCard, setQuizCard] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const router = useRouter();
    const handleRoute = async (route, event) => {
        event.preventDefault();
        const body = document.querySelector('body');
        body.style.color = 'white'; // Change text color to desired color
        body.style.backdropFilter = 'blur(20px)'; // Add backdrop filter for a blur effect
        body.style.opacity = '0';
        body.style.transform = 'translateY(40px)'; // Add a transition effect for the body
    
        // Wait for animation to complete before navigation
        await new Promise(resolve => setTimeout(resolve, 400));
    
        // Navigate after the animation
        router.push(route);
    
        // Reset styles after a delay (no events to catch route change completion)
        setTimeout(() => {
          body.style.backdropFilter = ''; // Reset backdrop filter after navigation
          body.style.color = ''; // Reset text color after navigation
          body.style.transform = ''; // Reset transform after navigation
          body.style.opacity = '1'; // Reset opacity after navigation
        }, 300);
      };
    const genereateQuizCard = (result)=> {
        if (result.type === 'flash'){
            return {
                type: 'flash',
                question: result.question,
                answer: result.answer,
            };
        } else if (result.type === 'multiple'){
            return {
                type: 'mutliple',
                question: result.question,
                options: [ result.option1, result.option2, result.option3, result.option4],
                answer: result.answer,
            };
        } else if (result.type === 'error'){
            return{
                type: 'error',
                question: 'Error generating quiz card.',
                answer: 'Unknown',
            }
        }
        return null;
    };

    const fetchTranscriptions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/transcriptions');
            const transcriptionsList = response.data.transcriptions;
            const concatenatedTranscriptions = transcriptionsList.join(' ');

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({text: concatenatedTranscriptions, questionType: '1'}),
            });

            const result = await res.json();
            console.log("Generated Quiz Card: ", result);

            const quizCard = genereateQuizCard(result);
            setQuizCard(quizCard);
            
            return result;

        } catch (error) {
            console.error('Error fetching transcript:', error);
            throw error;
        }   
    };

    const handleGenerateQuiz = async () => {
        try{
            const result = await fetchTranscriptions();
            const type = result.type;
            const question = result.question;
            const answer = result.answer;

            const user = auth.currentUser;
            if (!user){
                throw new Error('No user is signed in.');
            }

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            const groupId = userDoc.data().groupId;
            if (!groupId){
                throw new Error('No group ID found for user.');
            }

            if (type !== 'error'){
                const pinResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
                    pinataOptions: { cidVersion: 1},
                    pinataMetadata: { name: `question-answer-${groupId}`},
                    pinataContent: { type, question, answer},
                },{
                    headers: {
                        pinata_api_key,
                        pinata_secret_api_key,
                        'Content-Type': 'application/json',
                    },
                });
    
                const cid = pinResponse.data.IpfsHash;
                console.log('Pinned question-answer:', cid);
    
                await axios.put(`https://api.pinata.cloud/groups/${groupId}/cids`, {
                    cids: [cid],
                },{
                    headers: {
                        pinata_api_key,
                        pinata_secret_api_key,
                        'Content-Type': 'application/json',
                    }
                });
                console.log('Added CID to group:', groupId);
            }

            
        } catch (error){
            console.error('Error generating quiz:', error);
        }

        setIsButtonDisabled(true);

        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 10000);
    };

    return(
        <div className='videoplayer-container'>
            <div className='videoplayer'>
                <div>
                    <div className='page-header'>
                        <h1 className='page-title'>Video Player</h1>
                        <div className="home-button-container">
                        <PageButton label="Dashboard" handleClick={(e) => handleRoute('/dashboard', e)} />
                            </div>
                    </div>
                    <div className='video-container'>
                        <div>
                            <video className='uploaded-video' controls>
                                <source src="/rename.mp4" type="video/mp4" />
                            </video>
                            <div className='page-button'>
                            <button
                            onClick={handleGenerateQuiz}
                            disabled={isButtonDisabled}
                            >
                                {isButtonDisabled ? 'Generating Quiz...' : 'Generate Quiz'}
                            </button>
                            </div>
                        </div>
                        {quizCard && (
                            <Flashcard
                            question={quizCard.question}
                            answer={quizCard.answer}
                            isNew={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}