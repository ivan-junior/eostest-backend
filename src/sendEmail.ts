import nodemailer from 'nodemailer'
import { Attachment } from 'nodemailer/lib/mailer'

interface MailOptions {
	to: string
	subject: string
	htmlBody: string
	attachments?: Attachment[] | undefined
	bcc?: string | undefined
	replyTo?: string | undefined
	customFrom?: string | undefined
}

export default function sendEmail(mailOptions: MailOptions): boolean {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT),
			auth: {
				user: process.env.SMTP_USERNAME,
				pass: process.env.SMTP_PASSWORD
			}
		})

		transporter.sendMail(
			{
				from: mailOptions.customFrom || 'EOS Teste <cd907c7bb9-2b9ce6@inbox.mailtrap.io>',
				to: mailOptions.to,
				subject: mailOptions.subject,
				html: mailOptions.htmlBody,
				attachments: mailOptions.attachments,
				bcc: mailOptions.bcc,
				replyTo: mailOptions.replyTo
			},
			(err, info) => {
				if (err) {
					console.error(err)
					return false
				}
				console.info(`Email sent: ${info.response} / ${mailOptions.to}`)
				return true
			}
		)
	} catch (error) {
		console.error(error)
		return false
	}
}
