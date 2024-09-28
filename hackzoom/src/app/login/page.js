"use client";

import './login.css';
import PageButton from './page-button';
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
        return inputValue ? 'label-focus' : '';
    };

    return (
        <div className='login'>
            <div className='login-left-pane'>
                <img src='https://www.pngkey.com/png/full/114-1149878_avatar-unknown-dp.png' alt='avatar' height='200px'/>  
            </div>
            <div className='login-right-pane'>
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
                        <label className={`username-label ${getLabelClass(username)}`}>
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
                        <label className={`password-label ${getLabelClass(password)}`}>
                            Password
                        </label>
                    </div>
                    <PageButton label='Login' />
                </form>
            </div>
        </div>
    );
}