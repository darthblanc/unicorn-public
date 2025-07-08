import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../hidden/firebaseConfig.json' assert {type: 'json'};
import {getAuth, connectAuthEmulator} from 'firebase/auth'
import {AuthManager} from '../../pseudo-backend/auth_manager.js'
import { ErrorManager } from '../../pseudo-backend/error_manager.js';


const app = initializeApp(firebaseConfig);
const auth = getAuth();
connectAuthEmulator(auth, 'http://127.0.0.1:9099');
const errorManager = new ErrorManager();
const authManager = new AuthManager(auth, errorManager);
var testUser = null;

test('new user with valid email and password should be allowed to create an account', async () => { 
    const userCredential = await authManager.createUserWithEmailAndPassword(
        "testemail@testemail.test",
        "testpassword",
    );
    testUser = userCredential.user;
    expect(userCredential.user.email).toBe("testemail@testemail.test");
});

test('existing email cannot be used to create an account', async () => { 
    const userCredential = await authManager.createUserWithEmailAndPassword(
        "testemail@testemail.test",
        "testpassword",
    );
    expect(userCredential).toBe(null);
});

test('existing user cannot login with different password', async () => { 
    const userCredential = await authManager.signInWithEmailAndPassword(
        "testemail@testemail.test",
        "testpassword123",
    );
    expect(userCredential).toBe(null);
    authManager.deleteUser(testUser);
});

test('short password (< 6 characters) should not be allowed', async () => { 
    const userCredential = await authManager.createUserWithEmailAndPassword(
        "testemail@testemail.test",
        "testp",
    );
    expect(userCredential).toBe(null);
});

test('new user with invalid email or password not should be allowed to create an account', async () => { 
    const userCredential = await authManager.createUserWithEmailAndPassword(
        "testemailst",
        "testpassword",
    );
    expect(userCredential).toBe(null);
});

