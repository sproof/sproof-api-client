const Master = require ('../master');
const errors = require('throw.js');
const response = require ('./response');


exports.get = (req, res, next) => {
  let sproof = Master().sproof;
  if (sproof.events.length === 0)
    return next(new errors.BadRequest('Nothing to commit'));

  sproof.commitPremium((err, result) => {
    if (err) return next(new errors.CustomError('Server Error', err.message, err.status));
    let s = sproof;
    Master().storeEvents();
    Master().commitWorker.setExternalCommit((new Date()/1000));
    res.json(response(result));
  });
};