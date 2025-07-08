import React, { createContext, useContext } from 'react'
import {emulator} from './firebase_app.js'
import { EmulatorContext } from './EmulatorContext.js';


function EmulatorProvider ({ children }) {
  return (
    <EmulatorContext.Provider value={emulator}>
        {children}
    </EmulatorContext.Provider>
  )
}

export default EmulatorProvider;