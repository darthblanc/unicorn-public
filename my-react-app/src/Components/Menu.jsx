import { useEffect, useState } from "react";
import { FileBox } from "./FIleBox";
import MenuUI from "./MenuUI";
import { ErrorPage } from "./ErrorPage";
import { useData } from "../useDataHooks";
import { useAuth } from "../useAuthHooks";

export function Menu (){
    const [fileBoxes, setFileBoxes] = useState([]);
    const drawingsData = useData()
    const auth = useAuth()

    useEffect(() => {
        var fileBoxes = [];
        for (let i = 0; i < drawingsData.length; i++){
            fileBoxes.push(<FileBox key={i} drawing={drawingsData[i]} />);
        }
        setFileBoxes(fileBoxes);
    }, [drawingsData, auth]);
    
    return (
        <div id="menu" className="menu">
            {!auth ? <ErrorPage></ErrorPage> : (
                <div id="fileboxes">
                    <MenuUI />
                    {fileBoxes}
                </div>)}
        </div>
    )
}