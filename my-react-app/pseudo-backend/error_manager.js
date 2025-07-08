
/**
 * @description handles errors that show up
 */
export class ErrorManager{
    logError(error, feedback=""){
        console.log(feedback === "" ? `Error Occured: ${error}` : `Error Occured: ${error} because ${feedback}`);
    }
    getErrorString(error){
        return `${error}`;
    }
}