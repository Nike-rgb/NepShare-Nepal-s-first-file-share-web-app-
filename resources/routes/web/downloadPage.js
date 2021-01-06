const Router = require('express').Router();
const File = require('./../../../models/file.js');
require('dotenv').config();

Router.get('/:uuid', (req, res) => {
  File.findOne({uuid : req.params.uuid}, (err, doc) => {
    if(err) {
      return res.render('download', {
        error : "Something went wrong. Please try again.",
      });
    }

    if(!doc) {
      return res.render('download', {
        error : "Invalid or expired link.",
      });
    }

    doc.files.forEach(file => {
      file.downloadLink = `${process.env.APP_BASE_URL}/files/download/${doc.uuid}/${file.fileName}`;
    });

    res.render('download', {
      uuid : req.params.uuid,
      files : doc.files,
    });
  });
});

Router.post('/fetch-more-files', (req, res) => {
  let {uuid} = req.body;
  File.findOne({uuid}, (err, doc) => {
    if(err) {
      return res.send({'error' : 'Something went wrong. Refresh the page.'});
    }

    if(!doc) {
      return res.send({'error' : 'Invalid link or link expired'});
    }

    doc = doc.toObject();  //converting the mongoose document to a POJO

    let newFiles = [];

    doc.files.forEach(file => {
      if(!file.sentEarlier) {
        file.downloadLink = `${process.env.APP_BASE_URL}/files/download/${doc.uuid}/${file.fileName}`;
        newFiles.push(file);
      }
    });

    res.json({newFiles});
  });
});

module.exports = Router;
