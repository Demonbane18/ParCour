var os = require('os');
const emailUser = "fusin.scholar1@gmail.com";
const emailPassword = "oqvjmqierotfffjh";
const macPass = 'oqvjmqierotfffjh'
const winPass = "iiqeksnseirtdfhx";
if (os.type() != "Darwin")
 emailPassword == winPass;
else 
 emailPassword == macPass;

module.exports = {
    emailUser,
    emailPassword
}