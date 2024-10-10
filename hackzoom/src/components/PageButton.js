"use client";

import { useRouter } from "next/navigation";
import '@/app/globals.css';
export default function PageButton(props) {
    const router = useRouter();
    const handleRoute = (route, event) => {
        event.preventDefault();
        const body = document.querySelector('body');
        body.style.backgroundColor = '#000'; // Change background color to desired color
        body.style.color = 'white'; // Change text color to desired color
        body.style.backdropFilter = 'blur(20px)'; // Add backdrop filter for a blur effect
        body.style.opacity = '0';
        body.style.transform = 'translateY(20px)'; // Add a transition effect for the body
        new Promise(resolve => setTimeout(resolve, 300)).then(() => {
          router.push(route);
          body.style.backgroundColor = ''; // Reset background color after navigation
          body.style.backdropFilter = ''; // Reset backdrop filter after navigation
          body.style.color = ''; // Reset text color after navigation
          body.style.transform = ''; // Reset transform after navigation
          body.style.opacity = '1'; // Reset opacity after navigation
        });
    
      };
    return(
        <div className='page-button'>
            <button onClick={props.handleClick} >{props.label}</button>
        </div>
    );

}