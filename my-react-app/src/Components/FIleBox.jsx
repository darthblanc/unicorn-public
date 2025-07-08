
import {Card, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../useAuthHooks';
import { Timestamp } from 'firebase/firestore';

export function FileBox ({ drawing }){
    const [metadata, setMetaData] = useState(null); // this would be replaced by a call to firestore for metadata once files are made
    const auth = useAuth()

    // firestorage will now be used to store thumbnails for the files
    // useEffect(() => {
    //     emulator.storageManager.getMetaDataForDirectory(fileRef, setMetaData);
    // // thumnbnails are updated every 2 hours after the intial thumbnail (maybe)
    // }, []);
    
    return (
        <Button style={{width : "20rem", border : '1px solid black'}}>
            <Link to={{
                pathname: `/${auth.displayName}/workspace/${drawing["title"]}`
            }}
            state={{
                drawingData: drawing
            }}>
            <Card.Img height={200} width={280} style={{ border : '1px solid black'}} src='/pseudo-backend/user_files/image copy.png'/>
            <Card.Text>{drawing["title"]+".uni"}</Card.Text>
            <Card.Text>Size: {drawing["size"] !== null ? parseFloat(drawing["size"]).toFixed(2): 0} KB</Card.Text>
            <Card.Text>Layers: {metadata !== null ? metadata.layers : 0}</Card.Text>
            <Card.Text>Last Modified: {drawing["timestamp"] !== null ? convertToDateTimeString(drawing["timestamp"]) : "N/A"}</Card.Text>
            </Link>
        </Button>
    );
}

function convertToDateTimeString(timestamp) {
    const dateString = timestamp.toDate().toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
        })
    return `${dateString}`
}