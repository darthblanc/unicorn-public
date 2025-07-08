
export interface IEmailValidator {
    senderEmailIsValid(senderEmail: string) : boolean;
    messageIsValid(message: string): boolean;
}