import { useRef, useState } from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { signInMethod } from '../../pseudo-backend/signin_methods.js';
import { useAuthUpdate } from '../useAuthHooks.js';

export function Login(){
    const [emulator, setUser] = useAuthUpdate();
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const [failedSignIn, setFailedSignIn] = useState(false);
    const navigate = useNavigate();

    const handleClick = async ()=> {
        const userCredentials = await emulator.signIn({
            option: signInMethod.SignInUserWithEmailAndPassword,
            email: emailRef.current.value,
            password: passwordRef.current.value
        })
        setUser(userCredentials.user)
        if (!userCredentials){
            setFailedSignIn(true)
        }
        else {
            setFailedSignIn(false)
            navigate(`/${userCredentials.user.displayName}/menu/`)
        }
    }

    return (
        <div className="loginPage">
            <div className="loginbox">
                <div className="welcomeDiv">
                    <h3 className="welcome">
                        Sign into your Unicorn account
                    </h3>
                </div>
                <div className="emailDiv">
                    <label  className="loginEmailLabel">Email</label>
                    <input type="email" className="loginEmail" placeholder="Email" id="email" ref={emailRef}/>
                </div>
                <div className="passwordDiv" id="password">
                    <label  className="loginPasswordLabel">Password</label>
                    <input type="password" className="loginPassword" placeholder="Password" id="password" ref={passwordRef}/>
                </div>
                {failedSignIn === true ? <div className="invalidDetailsDiv">
                    <h5 className="invalidDetailsText">You have entered an invalid email or password</h5>
                </div> : <></>}
                <div className="signInDiv">
                    <button className="signInButton" onClick={handleClick}>Login</button>
                </div>
                <div className="signUpDiv">
                    <h5 className="signUpText">Don't have an account? <Link rel="stylesheet" to={{pathname: "/"}} className="signUpLink"> <u className="signUpLinkText">Sign Up</u> </Link></h5>
                </div>
                <div className="forgotPasswordDiv">
                    <h5 className="forgotPassword"> <Link rel="stylesheet" to={{pathname: "/password_reset"}} className="forgotPasswordLink"> <u className="forgotPasswordLinkText">Forgot Password</u> </Link></h5>
                </div>
            </div>
        </div>
    )
}
