import express from "express";
import cors from 'cors';
import fs from 'node:fs'
import { MailService } from '@sendgrid/mail'
import { TestEmailService } from "./TestEmailService";
import { SendGridEmailService } from "./SendGridEmailService";
import { EmailManager } from "./EmailManager";
import { IEmailValidator } from "./IEmailValidator";
import { EmailValidator } from "./EmailValidator";
import { IEmailManager } from "./IEmailManager";

const port = 3000;
const app = express();
app.use(express.json());
// const options = {
//   origin: "http://localhost:5173/"
// };
app.use(cors());
let apiKey = fs.readFileSync("dist/src/hidden/sendgridkey.txt").toString();
let emailValidator: IEmailValidator = new EmailValidator();
const testEmailManager: IEmailManager = new EmailManager(new TestEmailService(), emailValidator);
const sendGridEmailManager: IEmailManager = new EmailManager(new SendGridEmailService(new MailService(), apiKey), emailValidator);

const html = `
              <!DOCTYPE html>
              <html>
              <img src="https://wallpaperaccess.com/full/5549682.jpg" height="100" width="350">
              <h5>Here is your one time password reset link: </h5> <a href="https://leetcode.com/">Reset Password</a>
              <h5>Note that the link would expire in the next 24 hours.</h5>
              <h5>Best regards,</h5>
              <h5>The Unicorn Dev Team.</h5>
              </html>
              `

let content = {
  "from": "",
  "subject": "Testing",
  "text": "Hello, I am Andi\'s Tester.",
  "html": html
}

const sendEmail = async (emailManager: IEmailManager, content: any) => {
  let status = await emailManager.sendEmail(content)
      console.log(`status: ${status}`);
      return status;
}

app.get('/', (req, res) => {
  res.status(200).send('some dude\'s random server');
});

app.post('/email/TT', (req, res) => {
  let request: any = req.body;
  content["to"] = request["to"];
  let emailIsValid = testEmailManager.emailIsValid(content["to"], content["text"]);
  if (!emailIsValid){
    content["to"] = "";
    let statusCode: number = 400;
    res.status(statusCode).sendStatus(statusCode);
  }
  else {
    sendEmail(testEmailManager, content).then((statusCode)=>{
      content["to"] = "";
      res.status(statusCode).sendStatus(statusCode);
    });
  }
});


app.post('/email/SG', (req, res) => {
  let request: any = req.body;
  content["to"] = request["to"];
  let emailIsValid = sendGridEmailManager.emailIsValid(content["to"], content["text"]);
  if (!emailIsValid){
    content["to"] = "";
    res.status(400).sendStatus(400);
  }
  else {
    sendEmail(sendGridEmailManager, content).then((statusCode)=>{
      content["to"] = "";
      res.status(statusCode).sendStatus(statusCode);
    });
  }
});

app.listen(port, () => {
  return console.log(`Server started: http://localhost:${port}`);
});
