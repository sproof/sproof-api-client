const Master = require ('../master');
const errors = require('throw.js');
const response = require ('./response');


exports.get = (req, res, next) => {
  Master().sproof.getUser((err, result) => {
    if (result){
      return res.json(response({
        localEvents: Master().sproof.events,
        nextCommit: Master().commitWorker.getNextCommit('humanize'),
        lastCommit: Master().commitWorker.getLastCommitTime(),
        user: result,
      }));
    }
    else return next(new errors.CustomError('Server Error', err.message, err.status));
  });
};