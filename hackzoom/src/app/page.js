"use client";
import PageButton from "@/components/PageButton";
import { auth } from "../app/firebase";
import { useRouter } from "next/navigation";
export default function Page() {


  const router = useRouter();
  const handleRoute = (route, event) => {
    event.preventDefault();
    router.push(route);
    // const body = document.querySelector('body');
    // body.style.backgroundColor = '#fff'; // Change background color to desired color
    // body.style.color = 'white'; // Change text color to desired color
    // body.style.backdropFilter = 'blur(20px)'; // Add backdrop filter for a blur effect
    // body.style.opacity = '0';
    // body.style.transform = 'translateY(40px)'; // Add a transition effect for the body
    // new Promise(resolve => setTimeout(resolve, 300)).then(() => {
    //   router.push(route);
    //   body.style.backgroundColor = ''; // Reset background color after navigation
    //   body.style.backdropFilter = ''; // Reset backdrop filter after navigation
    //   body.style.color = ''; // Reset text color after navigation
    //   body.style.transform = ''; // Reset transform after navigation
    //   body.style.opacity = '1'; // Reset opacity after navigation
    // });

  };

  return (
    <div className="homepage">
      <h1 style={{ 'textAlign': 'center' }}>Welcome to <b style={{'fontFamily': 'Poppins', 'color':'#E57373'}}>HackMidTERMS</b>, your on-the-go lecture companion and testing partner!</h1>
      <p style={{ 'textAlign': 'center', 'fontFamily': 'Inter Tight', 'fontSize': '2rem', 'color': '#3f3f3f' }}>
        We help students test themselves while watching their lectures by providing interactive quizzes and flashcards that can be accessed anytime, anywhere!!
      </p>
      <div className="home-button-container" style={{'justifyContent':'center'}}>
        <PageButton label={auth.currentUser ? "Go to Dashboard" : "Login"} handleClick={(event) => { auth.currentUser ? handleRoute('/dashboard', event) : handleRoute('/login', event) }} />
          <div className='page-button'>
        <button  onClick={() => window.open('https://github.com/Vegito2367/HackMidwest2024/', '_blank')}>Github Page</button>
        </div>
      </div>
    </div>
  );
}
