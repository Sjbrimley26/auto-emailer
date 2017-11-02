const nodemailer = require("nodemailer");
const fs = require("fs");
// read in list of email addresses
// read in email to be sent
// send emails

emails = [];

var transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER, // This is what shows up in the "From" Line of the email, no matter what we put below
        pass: process.env.GMAIL_PASS
    }
});

readByLine();


function readByLine () { //comma, newline delineated file
  fs.readFile("emails.txt", "utf-8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    let info = data;
    console.log("Reading list of email addresses...");
    while (info !== "") {
      let nextIndex = info.indexOf(",");
      if (nextIndex !== -1) {
        let line = info.substring(0, nextIndex);
        emails.push(line);
        info = info.substring(nextIndex+1);
      }
      else {
        let line = info;
        emails.push(line);
        info = "";
        startMailing();
      }

    }
  });

}





function startMailing () {
    console.log("Sending emails...");
    let order = "";
    fs.readFile("letter.txt", (err, data) => { //letter.txt contains the email to be sent in plain text or html
        if (err) {
            return console.log(err);
        }
        order = data;

        emails.forEach(function(address) {
            var email = {
                from: 'donotreply.doormanstan@gmail.com', // Shows as the from email address anyway
                to: address,
                subject: "Test email",
                text: order
            };

            transport.sendMail(email, function(err, info){
               if (err) {
                  return console.log(err);
               }
               console.log('Message sent ' + info.response);
            });
        });
    });
}
