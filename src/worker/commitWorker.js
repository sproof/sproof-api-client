const moment = require('moment');
const _ = require('lodash');

class CommitWorker {
  constructor(master, config) {
    this.master = master;
    this.commitTime = config.time;
    this.commitInterval = config.interval;
    this.commitUseInterval = !!config.interval;
    this.lastCommitTime = (new Date()/1000);
    this.lastCommitError;

    this.startTimer();
  }

  startTimer(){
    let secondsToNextCommit = this.getNextCommit();
    console.info('Next commit is scheduled in ' + moment.duration(secondsToNextCommit, "seconds").humanize());
    setTimeout(() => this.run(), secondsToNextCommit*1000);
  }

  run(){
    this.commit();
    process.nextTick (() => this.startTimer());
  }

  getNextCommit(type){
    let secToWait;
    if (this.commitInterval) {
      secToWait = this.commitInterval * 60;
      let now = (new Date()/1000);
      let secWaited = (now - this.lastCommitTime)

      secToWait = secToWait - secWaited;
    }
    else{
      let [hour, minute] = this.commitTime.split(':');
      let t = moment().hour(hour).minutes(minute).second(0);
      if (t.isBefore(moment()))
        t.add(1, 'day');

      let duration = moment.duration(t.diff(moment()));
      secToWait = duration.asSeconds();
    }
    if(type === 'humanize')
      return moment.duration(secToWait, "seconds").humanize();

    return secToWait;
  }

  getLastCommitTime(){
    return this.lastCommitTime;
  }

  commit() {
    this.lastCommitTime = (new Date()/1000);

    if(_.isEmpty(this.master.sproof.events))
      return console.info('Nothing to commit...');
    this.master.sproof.commitPremium((err,res) => {
      console.info(`${this.master.sproof.events.length} events committed...`);
      if (err)
        this.lastCommitError = err;
      else {
        this.lastCommitError = null;
        this.master.storeEvents();
      }
    });
  }

  setExternalCommit(timestamp) {
    this.lastCommitTime = timestamp.toFixed(0);
  }

}

module.exports = CommitWorker;
