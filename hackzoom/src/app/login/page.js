"use client";
import '../globals.css';
import PageButton from '@/components/PageButton';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import axios from 'axios';
import Loading from '@/components/Loading';

require('dotenv').config();

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

const pinata_api_key = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const pinata_secret_api_key = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

export default function Login() {

    useEffect(() => {
        document.querySelector('body').style.overflowY = 'hidden';
        return () => {
            document.querySelector('body').style.overflowY = 'auto';
        };
    }, []);


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
        const signupElement = document.querySelector('.signup');
        if (signupElement) {
            const offsetTop = signupElement.offsetTop;
            window.scrollTo({
                top: offsetTop - 10,
                behavior: 'smooth'
            });
        }
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

    const handleHome = (e) => {
        e.preventDefault();
            const body = document.querySelector('body');
            body.style.backgroundColor = '#fff'; // Change background color to desired color
            body.style.color = 'white'; // Change text color to desired color
            body.style.backdropFilter = 'blur(20px)'; // Add backdrop filter for a blur effect
            body.style.opacity = '0';
            body.style.transform = 'translateY(40px)'; // Add a transition effect for the body
            delay(600);
              router.push('/');
              delay(600);
              body.style.backgroundColor = ''; // Reset background color after navigation
              body.style.backdropFilter = ''; // Reset backdrop filter after navigation
              body.style.color = ''; // Reset text color after navigation
              body.style.transform = ''; // Reset transform after navigation
              body.style.opacity = '1'; // Reset opacity after navigation

    };
    // Show a loading screen while checking for authentication state
    if (loading) {
        setTimeout(2000);
        return <Loading show = {loading} />;
    }

    return (
        <div className='login-signup-container'>
        <div className='login-signup'>
            {/* <Loading show={true} />   */}
            <div className='home-button-container'>
                                <PageButton label="Home" handleClick={(e) => handleHome(e)} />
                        </div>
            <div className='login'>
                
                <div className='login-left-pane'>
                    <video loop autoPlay={true} width='auto'>
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
        </div>
    );
}
