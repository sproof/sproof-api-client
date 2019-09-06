const File = require ('../../controllers/file');

module.exports = (api, path) => {
  api.route(path + '/file/register').post(File.register);
  api.route(path + '/file/revoke').post(File.revoke);
  api.route(path + '/file/verify/:id').post(File.verifyHash);
  api.route(path + '/file/verify').post(File.verify);
};
