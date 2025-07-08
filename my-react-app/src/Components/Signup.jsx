import { useRef, useState } from "react";
import './Signup.css'
import { Link, useNavigate } from 'react-router-dom'
import { signInMethod } from '../../pseudo-backend/signin_methods.js';
import { useAuthUpdate } from "../useAuthHooks.js";


export function SignUp(){
    const [emulator, setUser] = useAuthUpdate();
    const emailRef = useRef('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const firstNameRef = useRef('');
    const lastNameRef = useRef('');
    const [failedSignIn, setFailedSignIn] = useState(false);
    const [typingPassword, setTypingPassword] = useState(false);
    const navigate = useNavigate();

    const handleClick = async () => {
        if (password === passwordAgain && password.length >= 6){
            const userCredentials = await emulator.signIn({
                option: signInMethod.CreateUserWithEmailAndPassword,
                userDetails:  {
                    firstName: firstNameRef.current.value,
                    lastName: lastNameRef.current.value,
                },
                email: emailRef.current.value,
                password: password
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
    }


    return (
        <div className="signUpPage">
            <div className="signUpBox">
                <div className="welcomeDiv">
                    <h3 className="welcome">
                        Create your Unicorn account
                    </h3>
                </div>
                <div className="firstNameDiv">
                    <label  className="firstNameLabel">First Name</label>
                    <input type="text" className="firstName" placeholder="First Name" id="firstName" ref={firstNameRef}/>
                </div>
                <div className="lastNameDiv">
                    <label  className="lastNameLabel">Last Name</label>
                    <input type="text" className="lastName" placeholder="Last Name" id="lastName" ref={lastNameRef}/>
                </div>
                <div className="emailDiv">
                    <label  className="emailLabel">Email</label>
                    <input type="email" className="email" placeholder="Email" id="email" ref={emailRef}/>
                </div>
                <div className="passwordDiv" id="password">
                    <label  className="passwordLabel">Password</label>
                    <input type="password" className="password" placeholder="Password" id="password" onChange={input => {
                        setTypingPassword(true);
                        setPassword(input.target.value);}}/>    
                </div>
                <div className="passwordAgainDiv">
                    <label  className="passwordAgainLabel">Confirm</label>
                    <input type="password" className="passwordAgain" placeholder="Password" id="passwordAgain" onChange={input => 
                        setPasswordAgain(input.target.value)}/>
                </div>
                    {!typingPassword || password.length >= 6 ? <></> : 
                        <h5 className="invalidDetailsText">Password should be atleast 6 characters</h5>}
                    {password === passwordAgain ? <></> : 
                        <h5 className="invalidDetailsText">Passwords do not match</h5>}
                    {failedSignIn === true ? <div className="invalidDetailsDiv">
                        <h5 className="invalidDetailsText">You have entered an invalid email or password</h5>
                </div> : <></>}
                <div className="signUpDiv">
                    <button className="signUpButton" onClick={handleClick}>Sign up</button>
                </div>
                <div className="signInDiv">
                    <h5 className="signIn">Already have an account? <Link rel="stylesheet" to={{pathname: "/login"}} className="signInLink"> <u className="signInLinkText">Sign In</u> </Link></h5>
                </div>
            </div>
        </div>
    )
}