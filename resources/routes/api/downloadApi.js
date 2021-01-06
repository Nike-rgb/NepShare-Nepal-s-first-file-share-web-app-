const Router = require('express').Router();
const File = require('./../../../models/file.js');

Router.get('/:uuid/:fileName', (req, res) => {
  File.findOne({uuid : req.params.uuid}, (err, doc) => {
    if(err) {
      return res.render('download', {
        error : "Something went wrong. Please try again",
      });
    }

    if(!doc) {
      return res.render('download', {
        error : "Invalid link or expired link",
      });
    }
      let path = `${__dirname}/../../../uploads/${req.params.fileName}`;
      res.download(path);
  });
});

module.exports = Router;
