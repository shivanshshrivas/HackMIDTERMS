"use client";
import { useState } from "react";
import '@/app/globals.css';
export default function PageButton(props) {
    
    return(
        <div className='page-button'>
            <button onClick={props.handleClick} >{props.label}</button>
        </div>
    );

}