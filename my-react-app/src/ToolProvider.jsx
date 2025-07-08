import React, { useRef } from 'react'
import { ToolContext, ToolUpdateContext } from './ToolContext'

const ToolProvider = ({ children }) => {
    const toolRef = useRef(null)
    
    const switchTool = (newTool) => {
        console.log(newTool)
        toolRef.current = newTool
    }
    return (
        <ToolContext.Provider value={toolRef}>
            <ToolUpdateContext.Provider value={switchTool}>
                {children}
            </ToolUpdateContext.Provider>
        </ToolContext.Provider>
    )
}

export default ToolProvider