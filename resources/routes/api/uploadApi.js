const Router = require('express').Router();
require('dotenv').config();
const multer = require('multer');
const File = require('./../../../models/file.js');
const {v4 : uuid4} = require('uuid');
const path = require('path');

let storage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename : (req, file, cb) => {
    const name = `${Date.now()}${Math.floor(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits : {
    filesize : 2*20 * 100, //100 MB
  },
}).array('myfile');

Router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if(err) return res.json({
      error : "Sorry something went wrong",
    });

    let files = [];

    req.files.forEach(file => {
      files.push({
        fileName : file.filename,
        fileSize : file.size,
        fileOriginalName : file.originalname,
      });
    });

    //store file info in the database
    new File({
      files,
      uuid : uuid4(),
    }).save((err, file) => {
      if(err) {
        return res.json({
          error : 'Something went wrong',
        });
      }

      res.json({uuid : file.uuid, downloadPageLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`});
    });
  });
});

Router.post('/send-more-files', (req, res) => {
  upload(req, res, (err) => {
    let {uuid} = req.body;
    if(err) return res.json({
      error : "Sorry something went wrong",
    });

    //update the doc in the database
    File.findOne({uuid}, (err, doc) => {
      if(err) return res.json({
        error : "Sorry something went wrong",
      });

      if(!doc) {
        if(err) return res.json({
          error : "Invalid or expired link",
        });
      }

        doc.files.forEach(file => {
          file.sentEarlier = true;
        });

        //update and save
        req.files.forEach(file => {
          doc.files.push({
            fileName : file.filename,
            fileSize : file.size,
            fileOriginalName : file.originalname,
          });
        });

        doc.save((err, savedDoc) => {
          if(err) return res.json({
            error : "Sorry something went wrong",
          });

          res.end();
      });
    });
  });
});

module.exports = Router;
