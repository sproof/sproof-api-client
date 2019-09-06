const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require ('cors');
const http = require('http');
const fileUpload = require('express-fileupload');
const winstonLogger = require('./utils/log');
const error = require('throw.js');

let authRequired = (req) => {
  let freeRoutes = [
    'file\/verify',
    'file\/verify\/.{66}',
    '\/'
  ];

  let path = req.url;
  path = path.replace('/api/v1/','');

  return !(freeRoutes.find(r => path.match(`^${r}$`)));
};


class Server {
  constructor(master, config) {
    this.master = master;
    this.config = config;

    const api = express();


    api.use(require("morgan")("dev", { "stream": winstonLogger.stream }));
    api.use(cors());
    api.use(compression());

    api.use(bodyParser.json({ limit: '15MB', type:'application/json'}));
    api.use(bodyParser.urlencoded({limit:'10mb', extended: true}));


    api.use(fileUpload({
      limits: { fileSize: 5 * 1024 * 1024 }
    }));

    const dir =  __dirname + '/../dist/';

    api.use(express.static(dir));

    api.use( (req, res, next) => {
      if (authRequired(req) && req.query.accessCode !== this.master.accessCode){
        return next(new error.Unauthorized('Invalid access code.'));
      }
      return next();
    });

    fs.readdirSync(path.join(__dirname, 'routes/v1')).map(file => {
      require('./routes/v1/' + file)(api, '/api/v1');
    });



    api.use((err, req, res, next) => {
      console.error(err);
      if (this.config.env != 'development') {
        delete err.stack;
      }
      let statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
      res.status( statusCode || 500).json({error: err.message, result: null});

    });


    let server = http.createServer(api);


    server.listen(config.api.port, err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.info(
        `API is now running on port ${config.api.port} in ${config.env} mode`
      );
    });
  }
}
module.exports = Server;