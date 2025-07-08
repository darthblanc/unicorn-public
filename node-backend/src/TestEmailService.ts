import { IEmailService } from "./IEmailService";

export class TestEmailService implements IEmailService{
    async send(content: any): Promise<number> {
        console.log(content);
        return 200;
    }
}