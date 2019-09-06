const State = require ('../../controllers/state');

module.exports = (api, path) => {
  api.route(path + '/state').get(State.get);
};
