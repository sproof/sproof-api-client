const Master = require ('../master');
const errors = require('throw.js');
const response = require ('./response');
const { Registration } = require('js-sproof-client');

let getFileFromRequest = function (req){
  let file;

  if (req.files && req.files.file){
    file = req.files.file.data;
  }
  if (!Buffer.isBuffer(file)) return false;

  return file;
}

exports.register = async (req, res, next) => {
  let sproof = Master().sproof;

  let file = getFileFromRequest(req);

  if (!file)
    return next(new errors.BadRequest('Invalid params, needs a Buffer with name file as form data input'));

  let name = req.query.name;
  let publish = req.query.public === 'true';


  let locationHash;

  if (publish){
   try {
     locationHash = (await sproof.uploadFilePromise(file)).hash;
   }catch(err) {
     return next(new errors.CustomError('Server Error', err.message, err.status));
   }
  }

  let documentHash = sproof.getHash(file);

  let reg = new Registration({documentHash, locationHash, name});

  sproof.registerDocumentBulk(reg);

  //TODOVadd event to sproof

  res.json(response(sproof.getRegistrationInfos(reg)));

  Master().storeEvents();

};

exports.revoke = async (req, res, next) => {
  let sproof = Master().sproof;

  let file = getFileFromRequest(req);

  if (!file)
    return next(new errors.BadRequest('Invalid params, needs a Buffer with name file as form data input'));

  let reason = req.query.reason;


  let documentHash = sproof.getHash(file);

  sproof.revokeDocument(documentHash, reason);
  res.json(response("Revocation stored."));
  Master().storeEvents();

}

exports.verify = async (req, res, next) => {
  let sproof = Master().sproof;
  let file = getFileFromRequest(req);
  if (!file)
    return next(new errors.BadRequest('Invalid params, needs a Buffer with name file as form data input'));

  let documentHash = sproof.getHash(file);

  let verificationProfile = undefined;
  if (Master().config.showOnlyConfirmedIssuers)
    verificationProfile = Master().sproof.config.credentials.address

  sproof.getValidation(documentHash, verificationProfile, (err, result) => {
    if (result) res.json(response(result));
    else next(new errors.CustomError('Server Error', err.message, err.status))
  });
};

exports.verifyHash = async (req, res, next) => {
  let sproof = Master().sproof;
  let documentHash = req.params.id;

  let verificationProfile = undefined;
  if (Master().config.showOnlyConfirmedIssuers)
    verificationProfile = Master().sproof.config.credentials.address

  sproof.getValidation(documentHash, verificationProfile, (err, result) => {
    if (result) res.json(response(result));
    else {console.error(err); next(new errors.CustomError('Server Error', err.message, err.status))}
  });

};
