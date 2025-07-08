import React, { useEffect, useState } from "react";
import { useToolUpdate } from "./useToolHooks";

function Toolbox () {    
    const [x, setx] = useState(0);
    const [y, sety] = useState(0);
    let dragbarid = "ToolsDragBar";
    const updateTool = useToolUpdate()

    useEffect(() => { 
        let dragging = false
        let firstx = 0;
        let firsty = 0

        const pointerDown = (evt) => {
            if (evt.target.id==dragbarid) {
                document.getElementById(dragbarid).style.cursor = "grabbing";
                dragging = true;
                firstx = evt.clientX - x;
                firsty = evt.clientY - y;
            }
        }
        document.getElementById(dragbarid).addEventListener("pointerdown", pointerDown)

        const pointerUp = (evt) => {
            dragging = false;
            document.getElementById(dragbarid).style.cursor = "grab";

        }
        document.getElementById(dragbarid).addEventListener("pointerup", pointerUp)

        const pointerMove = (evt) => {
            
            if (dragging) {
                setx(evt.clientX - firstx);
                sety(evt.clientY - firsty);
            }
        }
        document.getElementById(dragbarid).addEventListener("pointermove", pointerMove)

        return () => {
            document.removeEventListener("pointerdown", pointerDown)
            document.removeEventListener("pointerUp", pointerUp)
            document.removeEventListener("pointerMove", pointerMove)
        }
    })
    return (
        <>
        <div className="Tools" style={{top: y + "px", left: x + "px", zIndex: "3"}}>
            <div id="ToolsDragBar" className="DragBar" ><span id="ToolsDragBar" style={{padding: "10px"}}>Toolbox:</span  ><button className="dragBarButton">X</button></div>
            <h1>Tools</h1>
            <hr></hr>
            <button> Selection Box</button> <button>Fuzzy Select</button>
            <button onClick={() => {
                document.getElementById("canv").style.cursor = "crosshair";
                updateTool("brush")}}>Brush</button>
            <button onClick={() => {
                document.getElementById("canv").style.cursor = "url('https://img.icons8.com/parakeet-line/24/fill-color.png'), auto"
                updateTool("fill")
            }}> Fill</button>
            <button onClick={() => {
                document.getElementById("canv").style.cursor = "url('https://img.icons8.com/material-outlined/24/eraser.png'), auto";
                updateTool("eraser")}}>Eraser</button>
            <button onClick={() => {
                document.getElementById("canv").style.cursor = "grab";
                updateTool("move")
            }}>Move</button>
            <hr></hr>
            <input type="range" min="1" max="100" step={0.1} id="brushsz" defaultValue="3"></input> <input style={{width: "50px"}} type="number" id="brushstep" step={0.1} defaultValue={3}></input>
            <span>Color: </span><input type="color" id="colorpicker"></input>
            <br></br><span>Pressure Sensitivity: <input type="checkbox"></input></span>
        </div>
        </>
    )
}


export default Toolbox