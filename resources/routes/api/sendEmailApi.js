const Router = require('express').Router();
const File = require('./../../../models/file.js');
require('dotenv').config();

Router.post('/', (req, res) => {
  let {emailTo, emailFrom, uuid} = req.body;

  //update the database
  File.findOne({uuid}, (err, doc) => {
    if(err || !doc) {
      return res.send({error : 'Something went wrong.'});
    }

    let receiver = doc.receivers.find(receiver => {  //prevent spam
      return receiver == emailTo;
    });

    if(receiver) {
      return res.send({'error' : `Email already sent to ${emailTo}`});
    }

    doc.receivers.push(emailTo);

    doc.save((err, doc) => {
      if(err) return res.send({error : "Something went wrong. Send it again"});

      //send response
      res.json({
        emailTo,
        emailFrom,
        downloadLink : `${process.env.APP_BASE_URL}/files/${uuid}`,
      });
    });
  });
});

module.exports = Router;
