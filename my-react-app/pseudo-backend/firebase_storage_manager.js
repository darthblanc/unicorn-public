import {ref, uploadBytes, deleteObject, getBytes, getBlob, listAll, getMetadata, uploadString} from 'firebase/storage'

export class FirebaseStorageManager{
    constructor(storage, errorManager){
        this.storage = storage;
        this.errorManager = errorManager;
    }

    async createUserDirectory(userId) {
        const storageRef = ref(this.storage, `users/${userId}/ignore/uni.ignore`);
        await uploadString(storageRef, '').catch((err) => {
            this.errorManager.logError(err, 'whilst uploading string')
        });
    }

    async getUnicornImagesRefs(storagePath){
        const imageDirectoriesRef = ref(this.storage, storagePath);
        return (await listAll(imageDirectoriesRef)).prefixes;
    }

    async getMetaData(storagePath) {
        const storageRef = ref(this.storage, storagePath);
        // console.log(storageRef)
        const metadata = await getMetadata(storageRef);
        console.log(metadata.fullPath)
        return metadata;
    }

    async getUnicornImageRefs(storagePath){
        const imageDirectoriesRef = ref(this.storage, storagePath);
        return (await listAll(imageDirectoriesRef)).items;
    }

    async compareDates(date1, date2){
        const date1Time = new Date(date1);
        const date2Time = new Date(date2);
        return date1Time.getTime() > date2Time.getTime();
    }

    correctTimezone(date) {
        const dateTime = new Date(date);
        dateTime.setHours(dateTime.getHours()+19);
        return dateTime.toISOString();
    }

    async getMetaDataForDirectory(storagePath, setMetaData) {
        const storageRef = ref(this.storage, storagePath);
        const imageRefs = await this.getUnicornImageRefs(storageRef);
        var metadata = {size:0, layers:0, lastUpdated: "N/A"};
        var maxUpdate = -1;
        for (let i = 0; i < imageRefs.length; i++){
            const imageMetaData = (await this.getMetaData(imageRefs[i].fullPath));
            metadata.size += imageMetaData.size;
            metadata.layers += 1;
            if (maxUpdate === -1) {
                maxUpdate = this.correctTimezone(imageMetaData.updated);
                const updateDate = maxUpdate.split('T');
                metadata.lastUpdated = updateDate[0] + ' at ' + updateDate[1].substring(0,8);
            }
            else {
                const correctedUpdatedTime = this.correctTimezone(imageMetaData.updated);
                if (!this.compareDates(maxUpdate, correctedUpdatedTime)) {
                    maxUpdate = correctedUpdatedTime;
                    const updateDate = maxUpdate.split('T');
                    metadata.lastUpdated = updateDate[0] + ' at ' + updateDate[1].substring(0,8);
                }
            }

        }
        setMetaData(metadata);
        return metadata;
    }

    /**
     * 
     * @param {string} storagePath
     * takes a path on firebase storage 
     * 
     * saves image to firebase storage
     * 
     * correct path construction => users/{userId}/{imageName}/layer_{index}.{extension}
     * @returns {}
     */
    async  saveImage(storagePath, imageData){
        const imageRef = ref(this.storage, storagePath);
        const customMetadata = {};
        const metadata = {customMetadata: customMetadata};
        uploadBytes(imageRef, imageData, metadata)
        .then(() => {
            console.log("Image was uploaded successfully");
        })
        .catch((err) => {
            this.errorManager.logError(err);
        });
    }

    /**
     * 
     * @param {string} storagePath
     * takes a path on firebase storage 
     * 
     * saves image layers to firebase storage
     * 
     * correct path construction => users/{userId}/{imageName}/layer_{index}.{extension}
     * @returns {}
     */
    async saveImageLayers(storagePath, imageDataLayers){
        for (var i = 0; i < imageDataLayers.length; i++){
            const imageData = imageDataLayers[i];
            this.saveImage(storagePath+`layer_${i+1}.png`, imageData);
        }
    }

    //write a function that returns the image layers in the correct order
    async deleteImage(storagePath){
        const imageRef = ref(this.storage, storagePath)
        deleteObject(imageRef)
        .then(() => {
            console.log(`deleted ${storagePath}`);
        })
        .catch((err) => {
            this.errorManager.logError(err);
        })
    }
    
    /**
     * 
     * @param {string} storagePath
     * takes a path on firebase storage 
     * 
     * returns an array of Buffers for the corresponding image layers
     * 
     * correct path construction => users/{userId}/{imageName}/
     * @returns {Buffer[]}
     */
    // this method could also be used to update particular layers with precision
    async getImageLayers(storagePath, h, w){
        const imagerLayersRef = ref(this.storage, storagePath);
        const items = (await listAll(imagerLayersRef)).items;
        // const layerPaths = items.map((item) => [parseInt(item.fullPath.split('_')[1][0]), item.fullPath]);
        // layerPaths.sort()
        var layersArray = [];
        for (var i = 0; i < items.length; i++){
            layersArray.push(await this.getImageData(items[i], h, w));
        }
        // console.log(layersArray);
        return layersArray;
    }
    /**
     * 
     * @param {string} storagePath
     * takes a path on firebase storage 
     * 
     * returns a Buffer for a corresponding image layer
     * 
     * correct path construction => users/{userId}/{imageName}/layer_{index}.{extension}
     * @returns {Buffer}
     */
    async getImageData(storagePath, h, w){
        const imageRef = ref(this.storage, storagePath);
        const arrayBuffer = await getBytes(imageRef).catch((err) => {
            this.errorManager.logError(err);
        });
        return arrayBuffer;
    }

    async getImageBlobLayers(storagePath) {
        const imagerLayersRef = ref(this.storage, storagePath);
        const items = (await listAll(imagerLayersRef)).items;
        var layersArray = [];
        for (var i = 0; i < items.length; i++){
            layersArray.push(await this.getImageBlob(items[i]));
        }
        return layersArray;
    }

    async getImageBlob(storagePath) {
        const storageRef = ref(this.storage, storagePath);
        const blob = await getBlob(storageRef);
        return blob;
    }
}
