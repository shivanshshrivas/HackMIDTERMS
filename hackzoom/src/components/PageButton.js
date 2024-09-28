"use client";
import { useState } from "react";
import '@/app/globals.css';
export default function PageButton(props) {
    
    return(
        <div className='page-button'>
            <button>{props.label}</button>
        </div>
    );

}