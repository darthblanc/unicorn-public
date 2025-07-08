import {Emulator} from '../pseudo-backend/emulator_app.js'
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../my-react-app/hidden/firebaseConfig.json' with {type: 'json'};
import {getAuth} from 'firebase/auth'
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions'
import { getFirestore } from 'firebase/firestore'

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();
const firestore = getFirestore();
const functions = getFunctions(app);
export const emulator = new Emulator(auth, storage, firestore, functions);