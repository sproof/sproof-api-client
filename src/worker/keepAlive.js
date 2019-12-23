const moment = require('moment');
const _ = require('lodash');

class KeepAlive {
  constructor(master) {
    this.master = master;
    this.sendKeepAlive();
    setInterval(() => this.sendKeepAlive(), 1 * 60 * 1000);
  }

  sendKeepAlive() {
    let secondsToNextCommit = this.master.commitWorker.getNextCommit();

    let nextCommit = moment().unix() + secondsToNextCommit;
    nextCommit = nextCommit.toFixed(0)
    if (this.master.config.sproof.credentials.sproofCode != 'YOUR SPROOF CODE')
      this.master.sproof.api.sproofClientKeepAlive({nextCommit, chainId: this.master.config.sproof.chainId}, (err,res) =>{
        if (err) console.error("Could not send keep alive message: " + JSON.stringify(err));
        else console.log('Send keep alive')
      });
  }
}
module.exports = KeepAlive;
