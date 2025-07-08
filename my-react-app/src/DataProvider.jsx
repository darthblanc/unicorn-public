import React, { useEffect, useState } from 'react'
import { useAuth, useAuthUpdate } from "./useAuthHooks"
import { DataContext } from './DataContext'
import { useEmulator } from './useEmulator'

const DataProvider = ({ children }) => {
    const auth = useAuth()
    const [ emulator, setUser] = useAuthUpdate()
    const [userDrawingData, setUserDrawingData] = useState([])
    // const [ numTrigger, setNumTrigger ] = useState(0)

    // useEffect(() => {
    //     const getUserDrawings = async () => {
    //         return await emulator.firestoreManager.getAllDrawings(auth.uid)
    //     }
    //     if (auth) {
    //         getUserDrawings().then((drawingData) => {
    //             setUserDrawingData(drawingData)
    //         })
    //     }
    //     else {
    //         emulator.getUserState(setUser)
    //     }
    // }, [auth])

    useEffect(() => {
        const getRefreshedUsedDrawings = async () => {
            await emulator.firestoreManager.listenToUserDrawingsData(auth.uid, setUserDrawingData)
        }

        if (auth) {
            getRefreshedUsedDrawings(setUserDrawingData).then((unsubscribeFunc) => {
                ""
            })
        }
        else {
            emulator.getUserState(setUser)
        }
    }, [auth])

    return (
        <DataContext.Provider value={userDrawingData}>
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider