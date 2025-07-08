
export interface IEmailManager {
    emailIsValid(senderEmail: string, message: string): boolean;
    sendEmail(content: any): Promise<number>;
}