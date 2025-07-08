
export interface IEmailService {
    send(content: any): Promise<number>;
}