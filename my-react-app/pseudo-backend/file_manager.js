import {writeFile, readFile} from 'node:fs';

/**
 * @description manages files
 */
export class FileManager {
    constructor(errorManager){
        this.errorManager = errorManager;
    }
    /**
         * @async
         * @param filePath: String
         * @param data: Any
         * @description writes data to a specific file asynchronously
         */
    async writeFile(filePath, data) {    
        await writeFile(filePath, data, 
            ((err)=>{if(err) this.errorManager.logError(err)}));
    }

    /**
         * @async
         * @param filePath: String
         * @param cd: callback function | on implementation ensure it takes two parameters: FileManager, Any
         * @description reads data from a file then executes a specified callback function
         */
    async readFile(filePath, cb){
        await readFile(filePath, ((err, data)=>
            {
                if(err){
                    this.errorManager.logError(err);}
                else{
                    cb(fileManager, data);
                }
            }
        ));
    }
}
