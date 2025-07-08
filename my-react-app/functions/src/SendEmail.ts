// import * as admin from 'firebase-admin'
import { MailService } from '@sendgrid/mail'
// import { TestEmailService } from "./TestEmailService";
import { SendGridEmailService } from "./SendGridEmailService";
import { EmailManager } from "./EmailManager";
import { IEmailValidator } from "./IEmailValidator";
import { EmailValidator } from "./EmailValidator";
import { IEmailManager } from "./IEmailManager";
import { AuthBlockingEvent } from 'firebase-functions/identity';
import {apiKey} from './hidden/sendgridkey'

const html = `
              <!DOCTYPE html>
              <html>
              <img src="https://wallpaperaccess.com/full/5549682.jpg" height="100" width="350">
              <h5>Thank you for choosing Unicorn!: </h5> <a href="https://leetcode.com/">Reset Password</a>
              <h5>Best regards,</h5>
              <h5>The Unicorn Dev Team.</h5>
              </html>
              `

let content = {
  "from": "cedettester@gmail.com",
  "to": "",
  "subject": "Testing",
  "text": "Hello, I am Andi\'s Tester.",
  "html": html
}

const sendEmail = async (emailManager: IEmailManager, senderEmail: string, content: any) => {
    let status = 400
    if (emailManager.emailIsValid(senderEmail, content.html)) {
        content.to = senderEmail;
        status = await emailManager.sendEmail(content);
    }   
        console.log(`status: ${status}`);
        return status;
}

export const welcomeEmailTrigger = (event: AuthBlockingEvent) => {

    const emailValidator: IEmailValidator = new EmailValidator();
    // const testEmailManager: IEmailManager = new EmailManager(new TestEmailService(), emailValidator);
    const sendGridEmailManager: IEmailManager = new EmailManager(new SendGridEmailService(new MailService(), apiKey), emailValidator);
    const userEmail = event.data?.email;
        if (userEmail){
            sendEmail(sendGridEmailManager, userEmail, content).then((statusCode) => {
                console.log(`Email sent to ${userEmail}`);
            }).catch((err) => {
                console.log(`Emal not sent because ${err}`);
            })
        }
        else {
            console.log("Email not sent");
        }
}
