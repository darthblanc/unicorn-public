import { useEffect, useState } from 'react';
import WorkSpace from './WorkSpace.jsx'
import { Route, Routes } from 'react-router-dom';
import {SignUp} from './Components/Signup.jsx'
import { Login } from './Components/Login.jsx';
import { PasswordReset } from './Components/PasswordReset.jsx';
import { Menu } from './Components/Menu.jsx';
import {emulator} from './firebase_app.js'
import { ErrorPage } from './Components/ErrorPage.jsx';
import { LoadingPage } from './Components/LoadingPage.jsx';
import EmulatorProvider from './EmulatorProvider.jsx';
import AuthProvider from './AuthProvider.jsx';
import DataProvider from './DataProvider.jsx';

export  function App(){
    return (
        <EmulatorProvider>
        <AuthProvider>
        <DataProvider>
            <Routes>
                <Route path="/" element={<SignUp />}> </Route>
                <Route path="/login" element={<Login />}></Route>
                {/* <Route path="/password_reset" element={<PasswordReset emulator={emulator} />}></Route> */}
                {/* <Route path=":id/workspace/:id" element={<WorkSpace emulator={emulator} user={authState} />}> </Route> */}
                <Route path=":id/workspace/:id" element={<WorkSpace />}> </Route>
                <Route path=":id/menu/" element={<Menu />}></Route>
                <Route path="/loading/" element={<LoadingPage />}></Route>
                <Route path="*" element={<ErrorPage />}></Route>
            </Routes>
        </DataProvider>
        </AuthProvider>
        </EmulatorProvider>
    );
}
