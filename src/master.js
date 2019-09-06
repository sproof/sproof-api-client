const config = require('../data/config');
//const Server = require('./serverPublic');
const ServerPrivate = require('./serverPrivate');
const {Sproof} = require ('js-sproof-client');
const store = require('./utils/db/store');

const CommitWorker = require('./worker/commitWorker');

class Master {
    constructor(config){
      require('./utils/log');
      this.config = config;


      this.sproof = new Sproof(config.sproof);
      this.sproof.events = this.readEvents();

      this.accessCode = this.getAccessCode();

      this.serverPrivate = new ServerPrivate(this, config);

      this.commitWorker = new CommitWorker(this, config.commit);

    }

    getAccessCode() {
      let accessCode;
      try {
        accessCode = store.getAccessCode();
        console.info(`Access code is set to: ${accessCode}`)
      }catch (err){
        accessCode = this.sproof.getSalt().slice(2);
        store.setAccessCode(accessCode);
        console.info(`New access code is generated: ${accessCode}`)
      }
      return accessCode;
    }

    storeEvents(){
      store.setEvents(this.sproof.events);
    }

    readEvents(){
      try {
        return store.getEvents();
      }catch (err){
        console.info("No events are persisted, init with empty list.")
      }
      return [];
    }


}

var master;
module.exports = () => {
    if (!master) master = new Master(config);
    return master;
};