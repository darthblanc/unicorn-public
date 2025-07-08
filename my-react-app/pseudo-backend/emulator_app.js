import { ErrorManager } from './error_manager.js';
import {StateManager} from './state_manager.js';
import {AuthManager} from './auth_manager.js'
import {connectAuthEmulator} from 'firebase/auth'
import { connectStorageEmulator } from 'firebase/storage';
import { connectFirestoreEmulator } from 'firebase/firestore'
import { connectFunctionsEmulator} from 'firebase/functions'
import { FirebaseStorageManager } from './firebase_storage_manager.js';
import { FirebaseStoreManager } from './firestore_manager.js';


export class Emulator{
    constructor(auth, storage, firestore, functions){
        connectAuthEmulator(auth, 'http://127.0.0.1:9099');
        if (location.hostname === "localhost"){
            connectStorageEmulator(storage, "127.0.0.1", 9199);
        }
        connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
        connectFunctionsEmulator(functions, "127.0.0.1", 5001);
        this.errorManager = new ErrorManager();
        this.authManager = new AuthManager(auth, this.errorManager);
        this.storageManager = new FirebaseStorageManager(storage, this.errorManager);
        this.firestoreManager = new FirebaseStoreManager(firestore, this.errorManager)
        this.stateManager = new StateManager(this.authManager, this.storageManager, this.firestoreManager, this.errorManager);
    }

    async signIn(payload){
        try{
            return await this.stateManager.signInUser(payload);
        }
        catch (err) {
            this.errorManager.logError(err);
            return null;
        }
    }

    async signOut(){
        return await this.stateManager.signOut();
    }

    async getImageDirectories(userId){
        return await this.storageManager.getUnicornImagesRefs(`users/${userId}`);
    }

    async loadData(userId){
        return await this.storageManager.getMetaData(`users/${userId}/test/test.png`);
    }

    bruh(){
        console.log("bruh")
        return ""
    }

    async sendPasswordResetEmail(email){
        await this.authManager.sendPasswordResetEmail(email);
    }

    getUserState(setUserAppDetails){
        this.stateManager.getAuthState(setUserAppDetails);
    }
}
