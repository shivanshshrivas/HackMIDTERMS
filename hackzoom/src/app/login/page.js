"use client";

import '../globals.css';
import PageButton from '@/components/PageButton';
import { useState } from 'react';




export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const getLabelClass = (inputValue) => {
        return inputValue ? '-focus' : '';
    };

    return (
        <div className='login'>
            <div className='login-left-pane'>
                {/* <img src='https://www.pngkey.com/png/full/114-1149878_avatar-unknown-dp.png' alt='avatar' height='200px'/>   */}
                <video loop autoPlay={true} width="auto">
                    <source src="/loginPageVid.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className='login-right-pane'>
                <div style={{'display':'block', 'width':'100%'}}>
                    <h1>Login</h1>
                    <form>
                        <div className='input-group'>
                            <input 
                                className='username-input' 
                                type="text" 
                                name="name" 
                                value={username} 
                                onChange={handleInputChange} 
                            />
                            <label className={`username-label${getLabelClass(username)}`}>
                                Username
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
                            <PageButton label='Sign Up' />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}