import {EmailManager} from '../src/EmailManager'
import {TestEmailService} from '../src/TestEmailService'
import {EmailValidator} from '../src/EmailValidator'

let emailManager = new EmailManager(new TestEmailService(), new EmailValidator());

test('email with proper syntax should be sent', async () => {
    const content = {
        "from": "",
        "subject": "Testing",
        "text": "Hello, I am Andi\'s Tester.",
        "to": "bruh@mail.com"
    }
    const statusCode = await emailManager.sendEmail(content);
    const codeBool = 200 <= statusCode <= 299;
    expect(codeBool).toBe(true);
});
