"use client";
import { useState } from "react";
import './page-button.css';
export default function PageButton(props) {
    
    return(
        <div className='page-button'>
            <button>{props.label}</button>
        </div>
    );

}