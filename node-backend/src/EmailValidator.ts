import { IEmailValidator } from "./IEmailValidator";

export class EmailValidator implements IEmailValidator {
    emailRegex = new RegExp(/^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/);

    senderEmailIsValid(senderEmail: string): boolean {
        return this.emailRegex.test(senderEmail);
    }
    messageIsValid(message: string): boolean {
        const prunedMessage = message.replace(' ', '');
        return prunedMessage.length > 0;
    }
    
}