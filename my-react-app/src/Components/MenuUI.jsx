import { useNavigate } from "react-router-dom";
import { useEmulator } from "../useEmulator";
import { useAuth } from "../useAuthHooks";

function MenuUI () {
    const navigate = useNavigate();
    const emulator = useEmulator();
    const user = useAuth();
    
    return (
        <>
        <div className="topBarUI">
        <button onClick={showFiles} >File</button>
            <div id="fileDropdown" style={{display: "none"}}>
                <button 
                    onClick={async () => {
                        // need to also fetch this data for the untitled count
                        // console.log(userData)
                        // userData["untitledCount"] += 1
                        // const untitledCount = userData["untitledCount"];
                        emulator.firestoreManager.setUserData(user.uid, {"untitledCount": 2})
                        navigate(`/${user.displayName}/workspace/untitled_${1}`)
                        }}>
                    New File
                </button> 
                <button onClick={() => document.getElementById("openfile").click()}>Open File (Ctrl+O)</button>
                <br></br>
                <button>Save As (Ctrl+Shift+S)</button>
                <hr></hr>
                <button>Settings</button>
                <hr></hr>
                <button>Quit Unicorn</button>
            </div>
            <button >Edit</button>
            <button>Filter</button>
            <button> Export</button>
            <button onClick={async () => {
                const signedOut = await emulator.signOut()
                if (signedOut){
                    navigate('/login');
                }
                }}>Sign Out</button>
            <input style={{display: "none"}} name="openfile" id="openfile" type="file"></input>
        </div>
        </>
    )
}


function showFiles() {
    document.getElementById("fileDropdown").style = "display: block;"

}

export default MenuUI;
