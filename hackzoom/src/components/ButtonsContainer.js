import PageButton from "./PageButton";
import { auth } from "../app/firebase";
import { useRouter } from "next/navigation";
import '@/app/globals.css';



export default function ButtonsContainer() {


    const router = useRouter();

    const handleRoute = (route) => {
        router.push(route);
    };

    return (
        <div className="home-button-container">
            <PageButton label = {auth.currentUser ? "Switch User" : "Login"} handleClick = {()=>{handleRoute('/login')}}/>
            {auth.currentUser && <PageButton label = "Dashboard" handleClick = {()=>{handleRoute('/dashboard')}}/>}
        </div>

    );
}