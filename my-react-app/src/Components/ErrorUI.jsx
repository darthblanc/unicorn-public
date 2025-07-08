import { useNavigate } from "react-router-dom";

function ErrorUI ({emulator}) {
    const navigate = useNavigate();
    return (
        <>
        <div className="topBarUI">
            <button onClick={() => {navigate('/login')}}>Sign In</button>
            <button onClick={() => navigate('/')}>Sign Up</button>
        </div>
        </>
    )
}


export default ErrorUI;
