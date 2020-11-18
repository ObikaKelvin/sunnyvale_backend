const fs = require('fs');
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

class emailController{
    constructor(user, url){
        this.to = user.email;
        this.url = url;
        this.from = `WVG <${process.env.EMAIL_FROM}>`;
        this.firstName = user.name.split(' ')[0];

    }

    async sendEmail(template, subject){
        const html = fs.readFile(`${__dirname}/dev-data/emails/${template}.pug`, {
            url: this.url,
            firstName: this.firstName
        });
        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };

        await this.transport.sendEmail(mailOptions);
    }

    

    async sendWelcome(){
        this.sendEmail('welcome', 'Welcome to WVG')
    }

    async sendResetToken(){
        this.sendEmail('resetToken', 'Your password reset token (valid for 10 mins)')
    }

    async verifyEmail(){
        this.sendEmail('verifyEmail', 'Please verify your email')
    }

    async successfulOrder(){
        this.sendEmail('verifyEmail', 'Successful Order')
    }

    async pendingOrder(){
        this.sendEmail('verifyEmail', 'Pending Order')
    }
}

module.exports = emailController;