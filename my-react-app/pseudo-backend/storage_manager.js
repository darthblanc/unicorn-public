
export class StorageManager{
    constructor(storage, errorManager){
        this.storage = storage;
        this.errorManager = errorManager;
    }

    async getMetaData(storagePath) {
        return await this.storage.getMetaData(storagePath);
    }

    /**
     * 
     * @param {string} storagePath
     * takes a path on firebase storage 
     * 
     * saves image to firebase storage
     * 
     * correct path construction => users/{userId}/{imageName}/layer_{index}.{extension}
     * @returns {Buffer[]}
     */
    async  saveImage(storagePath, imageData){
        this.storage.saveImage(storagePath, imageData);
    }

    /**
     * 
     * @param {string} storagePath
     * takes a path on firebase storage 
     * 
     * saves image layers to firebase storage
     * 
     * correct path construction => users/{userId}/{imageName}/layer_{index}.{extension}
     * @returns {Buffer[]}
     */
    async saveImageLayers(storagePath, imageDataLayers){
        this.storage.saveImageLayers(storagePath, imageDataLayers);
    }

    async deleteImage(storagePath){
        this.storage.deleteImage(storagePath);
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
    async getImageLayers(storagePath){
        return await this.storage.getImageLayers(storagePath);
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
    async getImageData(storagePath){
        return await this.storage.getImageData(storagePath);
    }
}
