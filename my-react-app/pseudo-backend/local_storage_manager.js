import fs from "fs/promises"

export class LocalStorageManager{
    constructor(storage=null, errorManager){
        this.errorManager = errorManager;
    }

    /**
     * 
     * @param {string} storagePath
     * takes a path on local storage 
     * 
     * saves image to local storage
     * 
     * correct path construction => users/{userId}/{imageName}/layer_{index}.{extension}
     * @returns {Buffer[]}
     */
    async  saveImage(storagePath, imageData){
        fs.writeFile(storagePath, imageData, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Saved locally...")
            }
        });
    }

    /**
     * 
     * @param {string} storagePath
     * takes a path on local storage 
     * 
     * saves image layers to local storage
     * 
     * correct path construction => users/{userId}/{imageName}/layer_{index}.{extension}
     * @returns {Buffer[]}
     */
    async saveImageLayers(storagePath, imageDataLayers){
        for (var i = 0; i < imageDataLayers.length; i++){
            const imageData = imageDataLayers[i];
            this.saveImage(storagePath+`layer_${i+1}.png`, imageData);
        }
    }
 
    /**
     * 
     * @param {string} storagePath 
     * 
     * this function is to be used to delete image buckets and images
     * 
     */
    async deleteImage(storagePath){
        fs.rm(storagePath, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Deleted");
            }
        })
    }
    
    /**
     * 
     * @param {string} storagePath
     * takes a path on local storage 
     * 
     * returns an array of Buffers for the corresponding image layers
     * 
     * this method could also be used to update particular layers with precision
     * 
     * correct path construction => users/{userId}/{imageName}/
     * @returns {Buffer[]}
     */
    async getImageLayers(storagePath){
        const files = await fs.readdir(storagePath);
        var imageLayers = [];
        for (let i = 0; i < files.length; i++){
            imageLayers.push(await this.getImageData(storagePath+'/'+files[i]))
        }
        return imageLayers;
    }
    /**
     * 
     * @param {string} storagePath
     * takes a path on local storage 
     * 
     * returns a Buffer for a corresponding image layer
     * 
     * correct path construction => users/{userId}/{imageName}/layer_{index}.{extension}
     * @returns {Buffer}
     */
    async getImageData(storagePath){
        return (await fs.readFile(storagePath));
    }
}
