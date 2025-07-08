import UI from './UI.jsx'
import CanvasLayer from './CanvasLayer.jsx'
import Toolbox from './Toolbox.jsx';
import Layers from './Layers.jsx';
import React, { useEffect, useState } from "react";
import { ErrorPage } from './Components/ErrorPage.jsx';
import { useAuth } from './useAuthHooks.js';
import ToolProvider from './ToolProvider.jsx';

function WorkSpace() {
    const [divs, setdivs] = useState([0]);
    const [error, setError] = useState(true);
    const [fileName, setFileName] = useState(`${generateFileName()}`)
    const user = useAuth();

    useEffect(() => {
        user ? setError(false) : setError(true)
    }, [user])

    return (
        <ToolProvider>
            {error ? <ErrorPage></ErrorPage> :
             <div className='WorkSpace'>
                <UI fileName={fileName} setFileName={setFileName}/>
                <CanvasLayer divs={divs} fileName={fileName}/>
                <Layers setdivs={setdivs} divs={divs}/>
                <Toolbox />
            </div>}
        </ToolProvider>
    )
}

export default WorkSpace;

function generateFileName(){
    const fileStringArray = location.pathname.split('/')
    return fileStringArray[3]
}