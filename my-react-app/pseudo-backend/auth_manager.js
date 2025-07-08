import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, deleteUser, sendPasswordResetEmail, confirmPasswordReset, updateProfile} from 'firebase/auth'

export class AuthManager{
    constructor(auth, errorManager){
        this.auth = auth;
        this.errorManager = errorManager;
    }

    getAuth(){
        return this.auth;
    }

    async createUserWithEmailAndPassword(email, userDetails, password){
        const userCredential = 
            await createUserWithEmailAndPassword(this.auth, email, password)
            .catch((err) => {
                this.errorManager.logError(err);
                return null;
        });
        if (userCredential){
            await updateProfile(userCredential.user, {displayName: `${userDetails.firstName}-${userDetails.lastName}-${"001"}`}).catch((err) => {
                this.errorManager.logError(err);
                return null;
            });
            console.log(`${userCredential.user.email} just created an account`);
            return userCredential;
        }
        return null;
    }

    async signInWithEmailAndPassword(email, password){
        const userCredential = 
            await signInWithEmailAndPassword(this.auth, email, password)
            .catch((err) => {
                this.errorManager.logError(err);
                return null;
        });
        if (userCredential){
            console.log(`${userCredential.user.email} just signed in`);
            return userCredential;
        }
        return null;
    }

    async signOut(){
        const signedOut =
            await signOut(this.auth).
        catch((err) => {
            this.errorManager.logError(err, "could not sign out");
            return false;
        });
        console.log("signed out");
        return signedOut !== false;
    }

    onAuthStateChanged(setUserAppDetails){
        const unsubscribe = onAuthStateChanged(this.auth, (user) => {
            if (user) {
                setUserAppDetails(user);
                console.log(`${user.email} state was observed`);
            }
            else {
                setUserAppDetails(null);
                console.log(`No user`);
            }
        });
        return () => unsubscribe()
    }

    async sendPasswordResetEmail(email){
        sendPasswordResetEmail(this.auth, email).then(()=>{console.log('Reset email sent')}).catch((err)=>console.log(err));
    }

    async deleteUser(user){
        await deleteUser(user).then(
            console.log(`deleted ${user}`)
        ).catch(
            console.log(`could not delete ${user}`)
        )
    }

    // https://firebase.google.com/docs/auth/web/start for how to keep track of sign in state
    // https://firebase.google.com/docs/reference/js/auth.user to find a list of available properties
    // https://firebase.google.com/docs/auth/web/google-signin google sign in   
}