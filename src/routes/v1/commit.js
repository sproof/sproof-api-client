const Commit = require ('../../controllers/commit');

module.exports = (api, path) => {
  api.route(path + '/commit').get(Commit.get);
};
