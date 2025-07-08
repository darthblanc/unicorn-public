import { doc, setDoc, getDoc, addDoc, collection, getDocs, query, where, deleteDoc, onSnapshot } from "firebase/firestore";
import { data } from "react-router-dom";

export class FirebaseStoreManager{
    constructor(firestore, errorManager){
        this.firestore = firestore;
        this.errorManager = errorManager;
    }

    async createUserData(userId){
        const data = {
            "untitledCount": 0
        }
        console.log(userId)
        await setDoc(doc(this.firestore, "users", `${userId}`), data)
        .then(() => {
            console.log("user data created")
        })
        .catch((e) => console.log(e));
        
        return data
    }

    async getUserData(userId){
        const docRef = doc(this.firestore, "users", `${userId}`)
        return (await getDoc(docRef)).data()
    }

    async setUserData(userId, data){
        await setDoc(doc(this.firestore, "users", `${userId}`), data)
        .then(() => {
            console.log("user data set")
        })
        .catch((e) => console.log(e));
    }

    async saveDrawingData(data, userId, title){
        const json = JSON.stringify(data);
        const sizeInBytes = new TextEncoder().encode(json).length;

        const userDrawingColRef = collection(this.firestore, "drawings", userId, "userDrawings")
        const queryDocs = await query(
            userDrawingColRef,
            where("title", "==", title)
        )
        const querySnaps = await getDocs(queryDocs)
        const identical = querySnaps.docs
        if (identical.length === 0) {
            await addDoc(userDrawingColRef, data)
            .then(() => {
                console.log(`(new) uploaded ${title} with size of ${sizeInBytes/1000} KB`)
            })
            .catch((err) => console.error(err))
        }
        else {
            await setDoc(identical[0].ref, data)
            .then(() => {
                console.log(`(old) uploaded ${title} with size of ${sizeInBytes/1000} KB`)
            })
            .catch((err) => console.err(err))
        }        
    }

    async getAllDrawings(userId){
        const userDrawingColRef = collection(this.firestore, "drawings", userId, "userDrawings")
        const queryRefs = await query (
            userDrawingColRef,
            where("valid", "==", true)
        )
        let drawingsData = []
        try {
            const querySnaps = await getDocs(queryRefs)
            querySnaps.forEach((querySnap) => {
                drawingsData.push(querySnap.data())
            })
        }
        catch (err) {
            return []
        }
        return drawingsData
    }

    async getDrawing(userId, title) {
        const userDrawingColRef = collection(this.firestore, "drawings", userId, "userDrawings")
        const queryRefs = await query (
            userDrawingColRef,
            where("title", "==", title),
            where("userid", "==", userId)
        )
        const querySnap = await getDocs(queryRefs).catch((err) => {
            console.error(err)
            return null
        })
        const identical = querySnap.docs
        if (identical.length === 0) return null
        const drawingData = identical[0].data()
        if (drawingData["valid"]) {
            return drawingData
        }
        return null
    }

    async renameDrawing(userId, oldTitle, newTitle) {
        const userDrawingColRef = collection(this.firestore, "drawings", userId, "userDrawings")
        const queryRefs = await query (
            userDrawingColRef,
            where("title", "==", oldTitle)
        )
        const querySnap = await getDocs(queryRefs).catch((err) => {
            console.error(err)
            return null
        })
        const identical = querySnap.docs
        if (identical.length === 0) return null
        const drawingData = identical[0].data()
        const userDrawingDocRef = identical[0].ref
        drawingData["title"] = newTitle
        await setDoc(userDrawingDocRef, drawingData).catch((err) => {
            console.error(err)
        })
    }

    async listenToUserDrawingsData(userId, setUserDrawingData) {
        const userDrawingColRef = collection(this.firestore, "drawings", userId, "userDrawings")
        const queryRefs = await query (
            userDrawingColRef,
            where("valid", "==", true)
        )
        const unsubscribe = onSnapshot(queryRefs, (querySnaps) => {
            let newDrawingsData = []
            querySnaps.forEach((querySnap) => {
                newDrawingsData.push(querySnap.data())
            })
            setUserDrawingData(newDrawingsData)
        })
        console.log("just listened")
        return () => unsubscribe()
    }

    async deleteDoc(title){
        // console.log(title, "to be deleted")
        // await deleteDoc(doc(this.firestore, "drawing", `${title}`))
        console.error("not implemented yet")
    }
}
