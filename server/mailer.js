const nodemailer = require('nodemailer')
function mail(to,subject,text) {
    // Generate test SMTP service account from ethereal.email
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    // Name	Ross O'Conner
    // Username	ross84@ethereal.email
    // Password	aRtCSHXCws1vJBGmTv

    // let transporter = nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //         user: 'ross84@ethereal.email',
    //         pass: 'aRtCSHXCws1vJBGmTv'
    //     }
    // });

    var transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
               user: 'robomed123@hotmail.com',
               pass: 'wywVew-qihxum-girxe8'
           }
       });

    // send mail with defined transport object
    let info = transporter.sendMail({
        from: 'robomed123@hotmail.com',
        to: to,
        subject: subject,
        text: text,
        html: `<h4>Hello, </h4>
        <p>`+text+`</p>`
    });
    return info
}

module.exports={mail}
