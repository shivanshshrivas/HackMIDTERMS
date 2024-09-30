"use client";
import '../globals.css';
import PageButton from '@/components/PageButton';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import axios from 'axios';
import ButtonsContainer from '@/components/ButtonsContainer';

require('dotenv').config();

const pinataData = {
    pinata_api_key: process.env.PINATA_API_KEY,
    pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
};

const pinata_api_key = '79599b71c1de011c35dc';
const pinata_secret_api_key = `a596eff5c702f93b055ea5d41a9d8907d11582c596854deea1161782ff109d2c`;

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signUpUsername, setSignupUsername] = useState('');
    const [signUpPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [signUpError, setSignUpError] = useState('');
    const [loading, setLoading] = useState(true); // Loading state to avoid flicker
    const router = useRouter();

    // Check for user authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // If the user is logged in, redirect to dashboard
                router.push('/dashboard');
            } else {
                setLoading(false); // Stop loading if no user is found
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard'); // Redirect to dashboard after login
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (signUpPassword !== signupConfirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signUpPassword);
            const user = userCredential.user;

            // Create a group on Pinata using API Key and Secret Key
            const options = {
                method: 'POST',
                url: 'https://api.pinata.cloud/groups',
                headers: {
                    pinata_api_key: pinata_api_key,
                    pinata_secret_api_key: pinata_secret_api_key,
                    'Content-Type': 'application/json'
                },
                data: {
                    name: `${user.uid}-group`
                }
            };

            const response = await axios(options);
            const groupId = response.data.id; // Get the group ID from Pinata

            // Store user data and group ID in Firestore
            await setDoc(doc(db, "users", user.uid), {
                signUpUsername,
                signupEmail,
                groupId,  // Save the group ID
                createdAt: new Date(),
            });

            router.push('/dashboard'); // Redirect to dashboard after sign-up
        } catch (error) {
            setSignUpError(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'signupEmail') {
            setSignupEmail(value);
        } else if (name === 'signupUsername') {
            setSignupUsername(value);
        } else if (name === 'signupPassword') {
            setSignupPassword(value);
        } else if (name === 'signupConfirmPassword') {
            setSignupConfirmPassword(value);
        }
    };

    const getLabelClass = (inputValue) => {
        return inputValue ? '-focus' : '';
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleSignUpClick = (e) => {
        e.preventDefault();
        scrollToBottom();
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        scrollToTop();
    };

    // Show a loading screen while checking for authentication state
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='login-signup'>
            <div className='login'>
                <div className='login-left-pane'>
                    <video loop autoPlay={true} width="auto">
                        <source src="/loginPageVid.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className='login-right-pane'>
                    <div style={{ 'display': 'block', 'width': '100%' }}>
                        <h1>Login</h1>
                        <form className='login-form' onSubmit={handleLogin}>
                            <div className='input-group'>
                                <input
                                    className='username-input'
                                    type="text"
                                    name="name"
                                    value={email}
                                    onChange={handleInputChange}
                                />
                                <label className={`username-label${getLabelClass(email)}`}>
                                    Email
                                </label>
                            </div>
                            <div className='input-group'>
                                <input
                                    className='password-input'
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={handleInputChange}
                                />
                                <label className={`password-label${getLabelClass(password)}`}>
                                    Password
                                </label>
                            </div>
                            <div className='login-button-container'>
                                <PageButton label='Login' />
                                <PageButton label='Sign Up' handleClick={handleSignUpClick} />
                            </div>
                            <div className='login-home-button-container'>
                                <PageButton label="Home" handleClick={() => router.push('/')} />
                            </div>
                            {error && <p>{error}</p>}
                        </form>
                    </div>
                </div>
            </div>

            <div className='signup'>
                <div className='login-left-pane'>
                    <video loop autoPlay={true} width="auto">
                        <source src="/loginPageVid.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className='login-right-pane'>
                    <div style={{ 'display': 'block', 'width': '100%' }}>
                        <h1>Sign Up</h1>
                        <form className='signup-form' onSubmit={handleSignUp}>
                            <div className='input-group'>
                                <input
                                    className='signup-email-input'
                                    type="text"
                                    name="signupEmail"
                                    value={signupEmail}
                                    onChange={handleInputChange}
                                />
                                <label className={`signup-email-label${getLabelClass(signupEmail)}`}>
                                    Email address
                                </label>
                            </div>
                            <div className='input-group'>
                                <input
                                    className='signup-username-input'
                                    type="text"
                                    name="signupUsername"
                                    value={signUpUsername}
                                    onChange={handleInputChange}
                                />
                                <label className={`signup-username-label${getLabelClass(signUpUsername)}`}>
                                    Username
                                </label>
                            </div>
                            <div className='input-group'>
                                <input
                                    className='signup-password-input'
                                    type="password"
                                    name="signupPassword"
                                    value={signUpPassword}
                                    onChange={handleInputChange}
                                />
                                <label className={`signup-password-label${getLabelClass(signUpPassword)}`}>
                                    Password
                                </label>
                            </div>
                            <div className='input-group'>
                                <input
                                    className='signup-confirm-password-input'
                                    type="password"
                                    name="signupConfirmPassword"
                                    value={signupConfirmPassword}
                                    onChange={handleInputChange}
                                />
                                <label className={`signup-confirm-password-label${getLabelClass(signupConfirmPassword)}`}>
                                    Confirm Password
                                </label>
                            </div>
                            <div className='login-button-container'>
                                <PageButton label='Sign Up' />
                                <PageButton label='Login' handleClick={handleLoginClick} />
                            </div>
                            <div className='error'>
                                {signUpError && <p>{signUpError}</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
