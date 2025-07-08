import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useEmulator } from "./useEmulator";
import { useAuth } from "./useAuthHooks";
import { useToolRef } from "./useToolHooks";
import { useSessionStorage } from "./useSessionStorage";
import { Timestamp } from "firebase/firestore";
import { quadtree } from "d3-quadtree"

export default function CanvasLayer({divs, fileName}) {
    const canvasElem = useRef(null);
    const location = useLocation()
    const drawingData = useRef(new Map())
    const interpolatedStrokes = useRef(new Map())
    const saveTimeoutRef = useRef(null);
    const fileNameRef = useRef(null);
    const emulator = useEmulator()
    const user = useAuth()
    const toolRef = useToolRef()
    sessionStorage.clear()
    let locationState = null
    if (location.state){
        locationState = location.state["drawingData"] ?? null
    }
    // const [sessionDrawingData, setSessionDrawingData] = useSessionStorage(`drawingData${fileName}`, locationState)

    useEffect(() => {
            let history = [];
            let brushsize = 30;
            let pressureamt = 0.5;
            let redohistory = [];
            let historyindex = 0;
            let maxhistorylen = 50;
            let lastmpos = [0,0];
            let mpos = [0,0];
            let mdown = false;
            let startpos = [0,0];
            let selection = [0, 0, 0, 0]
            let selectionimg;
            let lastdrawframe;
            let savevar;
            
            let stroke = {
                points: [],
                color: "black",
                size: 3,
                pressureamt: 1,
            }

            function onChange(num=5000) {
                fileNameRef.current = fileName;
                clearTimeout(saveTimeoutRef.current);
                saveTimeoutRef.current = setTimeout(async () => {
                    const fileName = fileNameRef.current;
                    const serializedDrawingData = Object.fromEntries(drawingData.current)
                    const json = JSON.stringify(serializedDrawingData);
                    const sizeInBytes = new TextEncoder().encode(json).length;
                    console.log(drawingData.current)
                    const newDrawingData = {"userid": user.uid, "timestamp": Timestamp.now(), "valid": true, "data": serializedDrawingData, "title": fileName, "size": sizeInBytes/1000}
                    emulator.firestoreManager.saveDrawingData(newDrawingData, user.uid, fileName)
                    // alert("just saved to the cloud")
                }, num);
            }

            async function paste () {
                const readimage = await navigator.clipboard.read();
                c.drawImage(readimage[0], 0, 0);
            }

            function drawLoadedImage(strokes) {
                for (const strokeDetails of Object.entries(strokes)) {
                    const stroke = strokeDetails[1]
                    const color = stroke.color
                    const points = stroke.points
                    const size = stroke.size
                    const pressureamt = stroke.pressureamt

                    drawingData.current.set(interpolatedStrokes.current.size, stroke)
                    let x = points[0]
                    let y = points[1]
                    reDrawAt(points[0], points[1], color, size, 0.5)
                    let lastx = x
                    let lasty = y
                    let interpolatedStroke = [[ x, y ]]
                    for (let i = 3; i < points.length; i+=2) {
                        [lastx, lasty] = interpolate(x + points[i-1], y + points[i], lastx, lasty, color, size, pressureamt, interpolatedStroke)
                    }
                    interpolatedStrokes.current.set(interpolatedStrokes.current.size, interpolatedStroke)
                }
            }

            const threadManagerWorker = new Worker(new URL('./threadManager.js', import.meta.url), {type: 'module'})
            let qTree = quadtree().x(p => p[0]).y(p => p[1])
            threadManagerWorker.onmessage = (e) => {
                const [taskName, quadTreeStrokes] = e.data
                if (taskName === "quadtree") {
                    qTree = quadtree().x(p => p[0]).y(p => p[1])
                    qTree.addAll(quadTreeStrokes)
                }
            }

            async function load(){
                const rawDrawingData = await emulator.firestoreManager.getDrawing(user.uid, fileName)
                if (!rawDrawingData) return
                drawLoadedImage(rawDrawingData["data"])
                threadManagerWorker.postMessage(["quadtree", interpolatedStrokes.current])
            }

            function cachefile () {
                if (historyindex>= maxhistorylen) {
                    history.splice(0,1);
                    historyindex = history.length -1;
                }
                historyindex++;
                history[historyindex] = c.getImageData(0, 0, canv.width, canv.height);
                onChange()
                history.length = historyindex + 1;
            }

            function undofile () {
                if (historyindex > 0) {
                    historyindex--;
                    c.clearRect(0, 0, canv.width, canv.height);
                    c.putImageData(history[historyindex], 0, 0);
                }
            }

            function redofile () {
                if (historyindex < history.length - 1) {
                    historyindex++;
                    c.clearRect(0, 0, canv.width, canv.height);
                    c.putImageData(history[historyindex], 0, 0);
                }
            }

            let  DrawAt = (x, y, color,) => {
                color = document.getElementById("colorpicker").value
                if (document.getElementById("brushstep").value != brushsize) {
                    brushsize = document.getElementById("brushstep").value;
                    document.getElementById("brushsz").value = brushsize;
                }
                else if (document.getElementById("brushsz").value != brushsize){
                    brushsize = document.getElementById("brushsz").value;
                    document.getElementById("brushstep").value = brushsize;
                }


                redohistory = [];
                let drawsize = brushsize * 0.5;
                c.fillStyle = color;
                c.beginPath();
                c.arc(x, y, drawsize, 0, 2 * Math.PI);
                c.fill()
            }

            let  reDrawAt = (x, y, color, brushsize, pressureamt) => {
                redohistory = [];
                let drawsize = brushsize * 0.5;
                c.fillStyle = color;
                c.beginPath();
                c.arc(x, y, drawsize, 0, 2 * Math.PI);
                c.fill()
            }

            const interpolate = (currentX, currentY, priorX, priorY, color, size, pressureamt, interpolatedStroke) => {
                const less = (a, b) => a < b
                const more = (a, b) => a > b
                const calculateThenDrawX = (comparator) => {
                    let interv = (currentX - priorX)/cside
                    let intervy = (currentY - priorY)/cside
                    while (comparator(priorX, currentX)) {
                        priorX += interv
                        priorY += intervy
                        reDrawAt(priorX, priorY, color, size, pressureamt);
                        interpolatedStroke.push([ priorX, priorY])
                    }
                }
                const calculateThenDrawY = (comparator) => {
                    let intervx = (currentX - priorX)/cside;
                    let intervy = (currentY - priorY)/cside;
                    while (comparator(priorY, currentY)) {
                        priorX += intervx
                        priorY += intervy
                        reDrawAt(priorX, priorY, color, size, pressureamt);
                        interpolatedStroke.push([ priorX, priorY])
                    }
                }

                let cside = Math.sqrt(Math.pow(currentX - priorX, 2)+ Math.pow(currentY - priorY, 2));
                if (Math.abs(currentX - priorX) > Math.abs(currentY - priorY) ) {
                    if (currentX > priorX) {
                        calculateThenDrawX(less)
                    }
                    else if (currentX < priorX) {
                        calculateThenDrawX(more)   
                    }
                }
                else {
                    if (currentY > priorY) {
                        calculateThenDrawY(less)
                    }
                    else if (currentY < priorY) {
                        calculateThenDrawY(more)
                    }
                }
                return [priorX, priorY]
            }

            const snapper = (x) => {
                return parseFloat(x.toFixed(4))
            }

            let mouseStrokes = []
            let mousemove = (x, y)=> {mpos = {x, y};
            
            switch (toolRef.current) {
                case "brush":
                    if (mdown) {
                        requestAnimationFrame(() => {
                            stroke.color = document.getElementById("colorpicker").value;
                            stroke.size = document.getElementById("brushstep").value;
                            DrawAt(mpos.x, mpos.y, stroke.color);
                            let [priorX, priorY] = stroke.points

                            //find a normalized vector to interpolate
                            // every pixel between the last block and this new one
                            let cside = Math.sqrt(Math.pow(mpos.x - lastmpos[0], 2)+ Math.pow(mpos.y - lastmpos[1], 2));
                            if (Math.abs(mpos.x - lastmpos[0]) > Math.abs(mpos.y - lastmpos[1]) ) {
                                if (mpos.x > lastmpos[0]) {
                                    let interv = (mpos.x - lastmpos[0])/cside
                                    let intervy = (mpos.y - lastmpos[1])/cside;
                                    while (lastmpos[0] < mpos.x) {
                                        lastmpos[0] += interv;
                                        lastmpos[1] += intervy
                                        DrawAt(lastmpos[0], lastmpos[1], stroke.color);
                                        mouseStrokes.push([ lastmpos[0], lastmpos[1] ])
                                    }
                                }
                                else if (mpos.x < lastmpos[0]) {
                                    let interv = (mpos.x - lastmpos[0])/cside;
                                    let intervy = (mpos.y - lastmpos[1])/cside;
                                    while (lastmpos[0] > mpos.x) {
                                        lastmpos[0] += interv;
                                        lastmpos[1] += intervy
                                        DrawAt(lastmpos[0], lastmpos[1], stroke.color);
                                        mouseStrokes.push([ lastmpos[0], lastmpos[1] ])
                                    }
                                }
                            }
                            else {
                                if (mpos.y > lastmpos[1]) {
                                    let intervx = (mpos.x - lastmpos[0])/cside;
                                    let intervy = (mpos.y - lastmpos[1])/cside;
                                    while (lastmpos[1] < mpos.y) {
                                        lastmpos[0] += intervx
                                        lastmpos[1] += intervy
                                        DrawAt(lastmpos[0], lastmpos[1], stroke.color);
                                        mouseStrokes.push([ lastmpos[0], lastmpos[1] ])
                                    }                                
                                }
                                else if (mpos.y < lastmpos[1]) {
                                    let intervx = (mpos.x - lastmpos[0])/cside;
                                    let intervy = (mpos.y - lastmpos[1])/cside;
                                    while (lastmpos[1] > mpos.y) {
                                        lastmpos[0] += intervx
                                        lastmpos[1] += intervy
                                        DrawAt(lastmpos[0], lastmpos[1], stroke.color);
                                        mouseStrokes.push([ lastmpos[0], lastmpos[1] ])
                                    }
                                }
                                else {
                                }
                            }
                            stroke.points.push(snapper(lastmpos[0]-priorX))
                            stroke.points.push(snapper(lastmpos[1]-priorY))
                        })
                    }
                    break;

                case "select":
                    if (mdown) {
                        selection[0] = startpos [0];
                        selection[1] = startpos[1];
                        selection[2] = x;
                        selection[3] = y;
                    }
                    break;
                case "eraser":
                    if (mdown) {
                        requestAnimationFrame(() => {
                            const inRadius = qTree.find(x, y, 1)
                            if (inRadius) {
                                // console.log(inRadius[2])
                                if (drawingData.current.has(inRadius[2])) drawingData.current.delete(inRadius[2])
                                if (interpolatedStrokes.current.has(inRadius[2])) interpolatedStrokes.current.delete(inRadius[2])
                            }
                        })
                    }
                    break;
                default:
                    break;
            }
            };

            let testfunc = (event) => {
                mousemove(event.clientX, event.clientY);
                pressureamt=event.pressure;
                stroke.pressureamt = pressureamt

            };
            let canv = document.getElementById("canv");
            const c = canv.getContext("2d", {willReadFrequently: true});

            const pointerDown = (evt)=>
                {
                // console.log("pointer down")
                if (evt.target.tagName == "BODY" || evt.target.tagName == "CANVAS") {
                    switch (toolRef.current) {
                        case "brush":
                            pressureamt = evt.pressure;
                            const evtX = evt.clientX
                            const evtY = evt.clientY
                            const color = document.getElementById("colorpicker").value;
                            const size = document.getElementById("brushstep").value
                            stroke.points.push(evtX)
                            stroke.points.push(evtY)
                            stroke.color = color
                            stroke.size = size
                            redohistory = [];
                            mdown = true;
                            lastmpos= [evtX, evtY];
                            startpos = [lastmpos[0], lastmpos[1]];
                            break;
                        
                        case "eraser":
                            mdown = true;
                            break

                        default:
                            break;
                        }
                        
                    }

                }

            const pointerUp = (evt)=>
                {
                    // console.log('pointer up')
                    mdown = false

                    switch(toolRef.current) {
                        case "select":
                            selectionimg = c.getImageData(selection[0], selection[1], selection[2] - selection[0],selection[3] - selection[1]);
                            break;
                        case "brush":
                            let strokeId = drawingData.current.size
                            while (drawingData.current.has(strokeId)) strokeId += 1
                            drawingData.current.set(strokeId, structuredClone(stroke))
                            interpolatedStrokes.current.set(strokeId, structuredClone(mouseStrokes))
                            threadManagerWorker.postMessage(["quadtree", interpolatedStrokes.current])
                            mouseStrokes = []
                            stroke.points = []
                            cachefile()
                            break;
                        case "eraser":
                            c.clearRect(0, 0, 1920, 1000);
                            for (const [k, stroke] of drawingData.current.entries()) {
                                const color = stroke.color
                                const points = stroke.points
                                const size = stroke.size
                                const pressureamt = stroke.pressureamt
                                let x = points[0]
                                let y = points[1]
                                reDrawAt(points[0], points[1], color, size, 0.5)
                                let lastx = x
                                let lasty = y
                                let interpolatedStroke = []
                                for (let i = 3; i < points.length; i+=2) {
                                    [lastx, lasty] = interpolate(x + points[i-1], y + points[i], lastx, lasty, color, size, pressureamt, interpolatedStroke)
                                }
                                interpolatedStrokes.current.set(k, interpolatedStroke)
                            }
                            cachefile()
                            threadManagerWorker.postMessage(["quadtree", structuredClone(interpolatedStrokes.current)])
                            break;
                            default:
                                break;
                        }
                    }

            const keyDown = (evt) => {
                if (((evt.ctrlKey) && (evt.key === 'z' || evt.key === 'Z') && (! (evt.shiftKey))) && !mdown) {undofile();}
                if (((evt.ctrlKey) && (evt.key === 'v' || evt.key === 'V') && (! (evt.shiftKey))) && !mdown) {paste();}
                if (((evt.ctrlKey && (evt.key === "y" || evt.key === "Y")  || (evt.shiftKey && (evt.key === 'Z' || evt.key === 'z')))) &&!mdown) {evt.preventDefault(); redofile();}
            }

            const movePointer = (evt)=> { testfunc(evt)}

            if (document.readyState === "loading") {
                // Loading hasn't finished yet
                document.addEventListener("DOMContentLoaded", load);
            } else {
                // `DOMContentLoaded` has already fired
                load();
            }

            const changeFileName = (evt) => {
                if (evt.key == "Enter") {
                    cachefile();
                }
            }

            document.getElementById("canv").addEventListener("pointerdown", pointerDown);
            document.getElementById("canv").addEventListener("pointerup", pointerUp);
            document.getElementById("canv").addEventListener("keydown", keyDown);
            document.getElementById("canv").addEventListener("pointermove", movePointer);
            document.getElementById("fileName").addEventListener("keyup", changeFileName);
            
            return () => {
                document.removeEventListener('pointerdown', pointerDown);
                document.removeEventListener('pointerup', pointerUp);
                document.removeEventListener("keydown", keyDown);
                document.removeEventListener("pointermove", movePointer);
                document.removeEventListener("DOMContentLoaded", load);
                document.removeEventListener("keyup", changeFileName);
            }

            }, [fileName, user])
            
    return (
            <div className="canvasDiv">
                <canvas className="canv" style={{pointerEvents: "auto", display: "block", zIndex: "0"}} height={1000} width={1920} onContextMenu={() => {return false;}} ref={canvasElem} id="canv"></canvas>
            </div>
    );
}
