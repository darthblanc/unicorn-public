import { use, useState } from "react";
import { signInMethod } from '../pseudo-backend/signin_methods.js';
import { useNavigate } from "react-router-dom";
import "./LoginAuth.css"

function LoginAuth ({emulator}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [failedSignIn, setFailedSignIn] = useState(null);
    const navigate = useNavigate();
    
    return (
        <div className="loginPage">
            <div className="loginbox">
                <div className="email">
                    {/* <label htmlFor="email" className="email">Email: </label> */}
                    <input type="email" className="email" placeholder="Email"/>
                </div>
                <div className="password">
                    <input type="text" className="password" placeholder="Password"/>
                </div>
                <div className="signIn">
                    <button className="signUp">Sign up</button>
                    <button className="login">Login</button>              
                </div>
            </div>
        </div>
    )
}


export default LoginAuth;

async function signIn(emulator, option, email, password){
    console.log("clicked sign in");
    const payload = {
        "option":  option,
        "email": email,
        "password": password,
    }
    try{
        const userCredential = await emulator.signIn(payload);
        if (userCredential){
            return false;
        }
        else {
            return true;
        }
    }
    catch (err){
        console.log(`Error: ${err}`);
        return true;
    }
}


// return (
//     <>
//     <div className="LoginUI">
//         <>
//             <h2>Login to Unicorn</h2>
//             {failedSignIn === true ? <h5 style={{color: 'red'}}>Invalid username or password</h5> : <></>}
//             <label htmlFor="email">Email:</label><br></br>
//             <input type="text" id="email" name="email" onChange={input => setEmail(input.target.value)}/>
//             <br></br>
//             <br></br>
//             <label htmlFor="password">Password:</label><br></br>
//             <input type="password" id="password" name="password" onChange={input => setPassword(input.target.value)}/>
//             <br></br>
//             <br></br>
//             <button onClick={async () => {
//                 setFailedSignIn(await signIn(emulator, signInMethod.SignInUserWithEmailAndPassword, email, password));
//                 if (failedSignIn === false) navigate('/workspace');
//                 }}>login</button>
//             <button onClick={async () => {
//                 setFailedSignIn(await signIn(emulator, signInMethod.CreateUserWithEmailAndPassword, email, password));
//                 if (failedSignIn === false) navigate('/workspace');
//                 }}>sign up</button>
//         </>
//     </div>
//     </>
// )