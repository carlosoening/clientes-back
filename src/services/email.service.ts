import { SmtpClient } from '../deps.ts';

class EmailService {

  async enviarEmail(to: string, subject: string, content: string, html?: string) {
    const client = new SmtpClient();
    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOSTNAME') || 'smtp.gmail.com',
      port: Number(Deno.env.get('SMTP_PORT')) || 465,
      username: Deno.env.get('SMTP_USERNAME'),
      password: Deno.env.get('SMTP_PASSWORD'),
    });
    await client.send({
      from: String(Deno.env.get('SMTP_USERNAME')),
      to,
      subject,
      content,
      html
    });
    await client.close();
  }

}

export default new EmailService();