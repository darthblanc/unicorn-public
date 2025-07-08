import { useNavigate } from "react-router-dom";
import './UI.css'
import { useEffect, useRef } from "react";
import { useEmulator } from "./useEmulator";
import { useAuth } from "./useAuthHooks";

function UI ({ fileName, setFileName}) {
    const navigate = useNavigate();
    const fileNameRef = useRef(fileName)
    const emulator = useEmulator()
    const user = useAuth()
     
    useEffect(() => {
        const hitEnter = (e) => {
            if (e.key == "Enter") {
                const title = fileName;
                // emulator.firestoreManager.deleteDrawing(title)
                const newFIleName = fileNameRef.current.value;
                emulator.firestoreManager.renameDrawing(user.uid, title, newFIleName)
                localStorage.removeItem(`drawingData${fileName}`)
                setFileName(newFIleName)
                const url = location.pathname.split('/')
                window.history.replaceState(null, "", `${url[0]}/${url[1]}/${url[2]}/${newFIleName}`)
            }
        }

        document.getElementById("fileName").addEventListener("keydown", hitEnter)

        return () => {
            document.removeEventListener("keydown", hitEnter)
        }
    }, [fileName])
    
    return (
        <div className="topBarUI" style={{zIndex: "2"}}>
            <button onClick={showFiles} >File</button>
            <div id="fileDropdown" style={{display: "none"}}><button onClick={() => document.getElementById("openfile").click()}>Open File (Ctrl+O)</button><br></br><button>Save As (Ctrl+Shift+S)</button><hr></hr><button>Settings</button><hr></hr><button>Quit Unicorn</button></div>
            <button >Edit</button>
            <button>Filter</button>
            <button> Export</button>
            <button onClick={async () => {
                const signedOut = await emulator.signOut();
                if (signedOut){
                    navigate('/login');
                }
                }}>Sign Out</button>
            <input style={{display: "none"}} name="openfile" id="openfile" type="file"></input>
            <input className="fileName" id="fileName" placeholder={fileName.split('.')[1] === "uni" ? fileName.split('.')[0] : `${fileName}`} ref={fileNameRef}></input>
        </div>
    )
}

function showFiles() {
    document.getElementById("fileDropdown").style = "display: block;"

}

export default UI;
