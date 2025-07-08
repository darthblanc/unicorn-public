import { IEmailManager } from "./IEmailManager";
import { IEmailService } from "./IEmailService";
import { IEmailValidator } from "./IEmailValidator";


export class EmailManager implements IEmailManager{
    emailService: IEmailService;
    emailValidator: IEmailValidator;
    emailIsValidBool = false;

    constructor(emailService: IEmailService, emailValidator: IEmailValidator){
        this.emailService = emailService;
        this.emailValidator = emailValidator;
    }

    emailIsValid(senderEmail: string, message: string): boolean {
        this.emailIsValidBool = this.emailValidator.senderEmailIsValid(senderEmail) && this.emailValidator.messageIsValid(message);
        return this.emailIsValidBool;
    }
    
    async sendEmail(message: string): Promise<number> {
        if (this.emailIsValidBool) {
            return await this.emailService.send(message);
        }
        else {
            return 400;
        }
    }
}