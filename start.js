const nodemailer = require("nodemailer");
const fs = require("fs");
// read in list of email addresses
// read in email to be sent
// send emails

emails = [];

function readByLine (emails, parseToArray) {
    var remaining = '';

    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        var last = 0;
        while (index > -1) {
            var line = remaining.substring(last, index);
            last = index + 1;
            parseToArray(line);
            index = remaining.indexOf('\n', last);
        }

        remaining = remaining.substring(last);
    });

    input.on('end', function() {
       if (remaining.length > 0) {
           parseToArray(remaining);
           startMailing();
       }
    });
}

function parseToArray (data) {
    emails.push(data);
}

var emails = fs.createReadStream('emails.txt'); //emails.txt should be newline delineated only
readByLine(emails, parseToArray);

var transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER, // Not sure if this can be different from the from line or what
        pass: process.env.GMAIL_PASS // store as environment variable instead
    }
});

function startMailing () {
    var order = "";
    fs.readFile("letter.txt", (err, data) => { //letter.txt contains the email to be sent in plain text or html
        if (err) {
            return console.log(err);
        }
        order = data;

        emails.forEach(function(address) {
            var email = {
                from: 'donotreply.doormanstan@gmail.com', // Becky's email so it looks natural
                to: address,
                subject: "To our friends or some shit",
                html: order // To be read in from external file, could use regular text instead
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
