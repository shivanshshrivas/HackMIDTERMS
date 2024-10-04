'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { onAuthStateChanged, signOut} from 'firebase/auth';
import Link from 'next/link';
import PageButton from '@/components/PageButton';
import Flashcard from '@/components/Flashcard';
import Loading from '@/components/Loading';

require('dotenv').config();

export default function Page() {


    const pinataData = {
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY
    };

    // State to store the file contents fetched from Pinata
    const [fileContents, setFileContents] = useState([]);
    // State to store any error messages
    const [error, setError] = useState('');
    // State to manage the loading state of the file fetching process
    const [loading, setLoading] = useState(true);
    // State to manage the loading state of the user authentication check
    const [isUserLoading, setIsUserLoading] = useState(true);

    // Initialize the Next.js router for redirection
    const router = useRouter();

    let temp 

    // useEffect hook to handle fetching files when the component mounts
    useEffect(() => {
        // Function to fetch files from Pinata for the authenticated user
        const fetchFiles = async (user) => {
            if (!user) {
                // If no user is logged in, set an error message and stop loading
                setError('No user is logged in.');
                setLoading(false);
                return;
            }

            try {
                // Retrieve the user's group ID from Firestore
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const groupId = userDoc.data().groupId;

                // Prepare the query to fetch files from Pinata's API for the specific group
                const options = {
                    method: 'GET',
                    url: `https://api.pinata.cloud/data/pinList?groupId=${groupId}`,
                    headers: {
                        pinata_api_key: pinataData.pinata_api_key,
                        pinata_secret_api_key: pinataData.pinata_secret_api_key,
                        'Content-Type': 'application/json'
                    },
                };

                // Make the request to fetch files (CIDs)
                const response = await axios(options);
                const files = response.data.rows;

                // Iterate through each CID and fetch the JSON data from IPFS
                const fileDataPromises = files.map(async (file) => {
                    const ipfsHash = file.ipfs_pin_hash;
                    try {
                        // Fetch the data from the IPFS gateway
                        const fileDataResponse = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
                        return {
                            question: fileDataResponse.data.question,
                            answer: fileDataResponse.data.answer,
                            cid: ipfsHash
                        };
                    } catch (error) {
                        console.error(`Error fetching file from IPFS with hash ${ipfsHash}:`, error);
                        return { question: "Error fetching data", answer: "", cid: ipfsHash };
                    }
                });

                // Wait for all the IPFS data to be fetched
                const fileData = await Promise.all(fileDataPromises);

                // Set the file contents to state
                setFileContents(fileData);
                setLoading(false);

            } catch (error) {
                // If there's an error fetching files, set an error message and stop loading
                setError('Error fetching files from Pinata.');
                setLoading(false);
                console.error(error);
            }
        };

        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, fetch the files
                fetchFiles(user);
            } else {
                // No user is signed in
                setLoading(false);
                setError('No user is signed in.');
            }
            // We have finished checking the auth state
            setIsUserLoading(false);
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();
    }, []);

    // Function to handle user logout
    const handleLogout = async () => {
        try {
            // Sign the user out using Firebase auth
            setIsUserLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await signOut(auth);
            setIsUserLoading(false);
            // Redirect the user to the home page
            router.push('/');
        } catch (error) {
            console.error('Error during sign out:', error);
            // If there's an error during sign out, set an error message
            setError('Failed to log out.');
        }
    };

    const handleHome = (e) => {
        e.preventDefault();
        router.push('/');
            // const body = document.querySelector('body');
            // body.style.backgroundColor = '#fff'; // Change background color to desired color
            // body.style.color = 'white'; // Change text color to desired color
            // body.style.backdropFilter = 'blur(20px)'; // Add backdrop filter for a blur effect
            // body.style.opacity = '0';
            // body.style.transform = 'translateY(40px)'; // Add a transition effect for the body
            // new Promise(resolve => setTimeout(resolve, 300)).then(() => {
            //   router.push('/');
            //   body.style.backgroundColor = ''; // Reset background color after navigation
            //   body.style.backdropFilter = ''; // Reset backdrop filter after navigation
            //   body.style.color = ''; // Reset text color after navigation
            //   body.style.transform = ''; // Reset transform after navigation
            //   body.style.opacity = '1'; // Reset opacity after navigation
            // });
    };
    return (
        <div className="dashboard-container">

            <div className="dashboard">
                <div className='dashboard-header'>
                    <h1 className="dashboard-title">Your Dashboard</h1>
                    
                    <div className="home-button-container" >
                        <PageButton className="home-button" label="Home" handleClick = {(e) => handleHome(e)} />
                        <PageButton className="add-button" label="Upload Video" handleClick = {() => router.push('/upload')} />
                        <PageButton className="logout-button" label="Logout" handleClick={handleLogout} />
                        
                            
                    </div>
                </div>
                
                {loading && <Loading show={loading}/>}
                {loading && <p className="loading-message">Loading pinned questions...</p>}
                {error && <p className="error-message">{error}</p>}
                {isUserLoading && <Loading show={isUserLoading}/>}
                {!loading && fileContents.length === 0 && <p className="no-data-message">No questions or answers found.</p>}
                <ul className="flashcard-container">
                    {fileContents.map((file, index) => (
                            <Flashcard key={index} question={file.question} answer={file.answer} cid = {file.cid} />
                    ))}
                </ul>
                
            </div>
        </div>
    );
};