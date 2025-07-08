import React, { useState, useEffect, useRef } from "react";

function Layers ({divs, setdivs}) {
    const [keynum, setkeynum] = useState(1);

    const [x, setx] = useState(1000);
    let dragbarid = "LayersDragBar";
    const [y, sety] = useState(0);

    useEffect(() => { 
        let dragging = false
        
        let firstx = 0;
        let firsty = 0;

        const pointerDown = (evt) => {
            if (evt.target.id=="LayersDragBar") {
                dragging = true;
                document.getElementById(dragbarid).style.cursor = "grabbing";
                firstx = evt.clientX - x;
                firsty = evt.clientY - y;
            }

        }
        document.getElementById(dragbarid).addEventListener("pointerdown", pointerDown)

        const pointerUp =  (evt) => {
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
    }, [])

    function addDivs () {
        
        let tempdivs = [];
        for (let i = 0; i < divs.length; i++) {
            tempdivs[i] = divs[i];
        }
        setkeynum((keynum+1));
        tempdivs.push(keynum);
        setdivs(tempdivs);
    }
    
    function deleteDiv(ind) {
        let tempdivs = [];
        for (let i = 0; i < divs.length; i++) {
            tempdivs[i] = divs[i];
        }
        for (let i = 0; i < tempdivs.length; i++) {
            if (tempdivs[i] == ind) {
                tempdivs.splice(i, 1);
            }
        }
        setdivs(tempdivs);
    }

    return (
        <>
        <div className="Layers" style={{top: y + "px", left: x + "px", zIndex:"3"}}>
            <div id="LayersDragBar" className="DragBar" ><span id="LayersDragBar" style={{padding: "10px"}}>Layers:</span><button className="dragBarButton">X</button></div>
            <button onClick={() => addDivs()} >ADD NEW LAYER</button><hr></hr>
            <div id="LayersScrollable">
            
            {divs.map((div) => (
            <label key={div}><div className="indivLayer">
            <span><input type="radio" name="layerselect"></input><span>Layer {div}</span></span> <button onClick={() => deleteDiv(div)}>X</button>
            </div></label>
            ))}
            </div>
           
        </div>
        </>
    )

}


export default Layers;