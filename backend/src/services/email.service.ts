import nodemailer, { Transporter } from "nodemailer";
import { env } from "../config/env";

let transporterPromise: Promise<Transporter> | null = null;

async function getTransporter(): Promise<Transporter> {
    if (transporterPromise) {
        return transporterPromise;
    }

    if (env.smtp.host && env.smtp.user && env.smtp.pass) {
        transporterPromise = Promise.resolve(
            nodemailer.createTransport({
                host: env.smtp.host,
                port: env.smtp.port,
                secure: env.smtp.port === 465,
                auth: { user: env.smtp.user, pass: env.smtp.pass }
            })
        );
        return transporterPromise;
    }

    transporterPromise = nodemailer.createTestAccount().then((testAccount) =>
        nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: { user: testAccount.user, pass: testAccount.pass }
        })
    );
    return transporterPromise;
}

export interface EmailAttachment {
    filename: string;
    content: Buffer;
}

export async function sendEmail(to: string, subject: string, html: string, attachments: EmailAttachment[] = []) {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
        from: env.smtp.from,
        to,
        subject,
        html,
        attachments
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
        console.log(`[email] Preview (Ethereal, mejl nije stvarno poslat): ${previewUrl}`);
    }
    return info;
}
