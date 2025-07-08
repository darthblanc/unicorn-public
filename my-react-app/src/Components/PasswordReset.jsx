import { useState } from 'react'
import './PasswordReset.css'
import { Link } from 'react-router-dom'
import { Emulator } from '../../pseudo-backend/emulator_app';
import { signInMethod } from '../../pseudo-backend/signin_methods';

export function PasswordReset({emulator}){
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [validEmail, setValidEmail] = useState(true);
    const [isTyping, setIsTyping] = useState(false);

    return (
        <div className="passwordResetPage">
            <div className="passwordResetBox">
                <div className="welcomeDiv">
                    <h3 className="welcome">
                        Reset your password
                    </h3>
                </div>
                <div className="emailDiv">
                    <label  className="loginEmailLabel">Email</label>
                    <input type="email" className="loginEmail" placeholder="Email" id="email" onChange={input => {
                        setEmail(input.target.value);
                        setValidEmail(isEmailValid(input.target.value))
                        setIsTyping(true);
                        }}/>
                </div>
                {validEmail === false && isTyping ? <div className="invalidDetailsDiv">
                    <h5 className="invalidDetailsText">Invalid Email</h5>
                </div> : <></>}
                <div className="emailSenderDiv">
                    <button className="emailSenderButton" onClick={
                        async ()=> {
                            if (validEmail){
                                setEmailSent(await sendEmail(emulator, email));
                            }
                            }}>Send Email</button>
                </div>
                <div className="signInDiv">
                    <h5 className="signIn"> 
                        <Link rel="stylesheet" to={{pathname: "/login"}} className="signInLink"> <u className="signInLinkText">Sign In</u> </Link>
                        <Link rel="stylesheet" to={{pathname: "/"}} className="signUpLink"> <u className="signUpLinkText">Sign Up</u> </Link>
                        </h5>
                </div>
            </div>
        </div>
    )
}

// notes: ensure that when "Forgot Password is clicked a new page is rendered which is where a user enters an email"
// a cloud/server side function is triggered that sends an email to the user. (ensure there is a cool down time, not more than 2 requests in a day)
// ensure that before sending anything to the server that the email is atleast plausible
// if it not trigger an error and render it on the page

// this function should be moved to its own file
// it would be used across the app in several ways/times
// implement a flagging system that tells the server what kind of email has to be sent. 
async function sendEmail(emulator, email) {
    // const body = {
    //     "to": email,
    // };
    // console.log(emulator.signIn, email)
    // emulator.bruh();
    // const e = new Emulator(null, null)
    // e.sendPasswordResetEmail
    await emulator.sendPasswordResetEmail(email);
    // const response = await fetch("http://localhost:3000/email/TT", {
    //     method: "POST",
    //     headers: {
    //         'Content-type': 'application/json'
    //     },
    //     body: JSON.stringify(body)
    // });
    // return 200 <= response.status && response.status <= 299
    return true;
}

function isEmailValid(email){
    const re = new RegExp(/^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/);
    return re.test(email);
}

// when a user triggers a reset email decision
// send a url to a webpage of our web app
// on that url provide a reset password page
// then listen to changes and change password on firebase