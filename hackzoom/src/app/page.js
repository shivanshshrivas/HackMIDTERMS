"use client";
import PageButton from "@/components/PageButton";
import { auth } from "../app/firebase";
import { useRouter } from "next/navigation";

export default function Page() {


  const router = useRouter();
  const handleRoute = (route, event) => {
    event.preventDefault();
    const body = document.querySelector('body');
    body.classList.add('page-transition');
    new Promise(resolve => setTimeout(resolve, 600))
    router.push(route);
    new Promise(resolve => setTimeout(resolve, 600))
    body.classList.remove('page-transition');
  };

  return (
    <div className="homepage">
      <div className="home-button-container">
        <PageButton label={auth.currentUser ? "Go to Dashboard" : "Login"} handleClick={(event) => { auth.currentUser ? handleRoute('/dashboard', event) : handleRoute('/login', event) }} />
      </div>
      <h1 style={{ 'textAlign': 'center' }}>Welcome to <b style={{'fontFamily': 'Poppins', 'color':'#E57373'}}>HackMidTERMS</b>, your on-the-go lecture companion and testing partner!</h1>
      <p style={{ 'textAlign': 'center', 'fontFamily': 'Inter Tight', 'fontSize': '2rem', 'color': '#3f3f3f' }}>
        We help students test themselves while watching their lectures by providing interactive quizzes and flashcards that can be accessed anytime, anywhere!!
      </p>
    </div>
  );
}
