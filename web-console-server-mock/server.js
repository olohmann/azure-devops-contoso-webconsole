const express = require('express')
const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, '/tmp/');
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const upload = multer({storage: storage}).single('war-file');
const app = express();

app.post('/applications/:id/upload', function (req, res) {
  const applicationId = req.params.id;
  console.log(`Application ID: ${applicationId}`);

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('multer: ' + err);
    } else if (err) {
      console.error('unknown error: ' + err);
    }

    console.log('upload successful');
    res.status(200).end();
  });
});

const port = process.env.PORT || 8080;
app.listen(port, function(a) {
  console.log(`Listening to port ${port}`);
});
