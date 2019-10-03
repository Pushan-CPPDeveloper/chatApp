require('dotenv').config();
const mailer =require('nodemailer');

exports.sendMail = (token, body, callback) => {
    // console.log(process.env.USERMAIL+" "+process.env.PASSWORD);
    var transporter = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSWORD
        },
        tls: { rejectUnauthorized: false }
    });

    let mailOptions = {
        from: process.env.USERMAIL,
        to: body,
        subject: 'testing node-mailer',
        text: "http://127.0.0.1:8080/#!/resetpass/" + token
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (!err) {
            callback(null, data);
        }else{
            callback(err);
        }
    });
}