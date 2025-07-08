import React, { useState } from 'react'
import { useEmulator } from './useEmulator'
import { AuthContext, AuthUpdateContext } from './AuthContext'

const AuthProvider = ({ children }) => {
    const emulator = useEmulator()
    const [user, setUser] = useState(null)
    const authPayload = [emulator, setUser]

    return (
        <AuthContext.Provider value={user}>
            <AuthUpdateContext.Provider value={authPayload}>
                {children}
            </AuthUpdateContext.Provider>
        </AuthContext.Provider>
    )
}

export default AuthProvider