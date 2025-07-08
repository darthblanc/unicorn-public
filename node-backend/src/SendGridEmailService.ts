import { MailDataRequired, MailService } from "@sendgrid/mail";
import { IEmailService } from "./IEmailService";

export class SendGridEmailService implements IEmailService{
    emailService: MailService;
    constructor (emailService: MailService, apiKey: string) {
        this.emailService = emailService;
        emailService.setApiKey(apiKey);
    }
    async send(content: MailDataRequired): Promise<number> {
        let clientResponse = [];
        try {
            clientResponse = await this.emailService.send(content);
            if (clientResponse){
                return clientResponse[0].statusCode
            }
        }
        catch (err) {
            console.log(err);
        }
        return 418;
    }
}
