import {signInMethod} from './signin_methods.js'

export class StateManager{
    constructor(authManager, storageManager, firestoreManager, errorManager){
        this.authManager = authManager;
        this.storageManager = storageManager;
        this.firestoreManager = firestoreManager;
        this.errorManager = errorManager;
    }

    async signInUser(authPayload){
        const option = authPayload["option"];
        const email = authPayload["email"];
        const password = authPayload["password"];
        try{
            switch (option) {
                case signInMethod.SignInUserWithEmailAndPassword:
                    return await this.authManager.signInWithEmailAndPassword(email, password);
                case signInMethod.CreateUserWithEmailAndPassword:
                    const userCredential = await this.authManager.createUserWithEmailAndPassword(email, authPayload["userDetails"], password);
                    if (userCredential !== null) {
                        await this.storageManager.createUserDirectory(userCredential.user.uid);
                        await this.firestoreManager.createUserData(userCredential.user.uid);
                        return userCredential;
                    }
                default:
                    break;
            }
        }
        catch(err){
            this.errorManager.logError(err, "could not sign user in");
        }
    }

    getAuthState(setUserAppDetails){
        this.authManager.onAuthStateChanged(setUserAppDetails);
    }
    async signOut(){
            return await this.authManager.signOut();
    }
}