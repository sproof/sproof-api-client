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
    this.commit((err, res) => {
      if (err) console.log(err);
    });
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

  getUser(){
    return new Promise((resolve, reject) => {
      this.master.sproof.user.getUser((err, res) => {
        if (err) reject(err);
        else resolve(res);
      })
    });

  }

  async commit(callback) {
    let sproof = this.master.sproof;

    this.setCommitTime();

    let onlineEvents = [...sproof.events];

    try {
      if (this.master.config.sproof.sproofPremium) {
        let user = await this.getUser();
        onlineEvents = user.events;
      }
    }catch (err) {
      if (callback) callback(err)
      return
    }

    this.master.sproof.events = this.master.sproof.prepareEvents(onlineEvents);

    let eventLength = this.master.sproof.events.length;


    if(_.isEmpty(this.master.sproof.events)) {
      console.info('Nothing to commit...');
      if (callback) callback({message: 'Nothing to commit', status: '3'})
      return
    }
    this.master.sproof.commitPremium((err,res) => {
      if (res) {
        console.info(`${eventLength} events committed...`);
      }else{
        console.error(err);
      }
      if (err) {
        this.lastCommitError = err;
        if (callback) callback(err)
      }
      else {
        this.lastCommitError = null;

        this.master.storeEvents();

        if (callback) callback(null, res);
      }
    });
  }

  //commit events premium

  setCommitTime(timestamp = new Date()/1000) {

    this.lastCommitTime = timestamp.toFixed(0);
  }

}

module.exports = CommitWorker;
