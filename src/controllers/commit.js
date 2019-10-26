const Master = require ('../master');
const errors = require('throw.js');
const response = require ('./response');


exports.get = (req, res, next) => {
  let sproof = Master().sproof;

  Master().commitWorker.commit((err, result) => {
    if (err) return next(new errors.CustomError('Server Error', err.message, err.status));
    else res.json(response(result));
  });
};
