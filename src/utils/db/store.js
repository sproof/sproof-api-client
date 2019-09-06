const fs = require('fs');


let write = function(filename, data) {
  fs.writeFileSync(`./data/${filename}`, JSON.stringify(data));
};

let read = function (filename) {
  return JSON.parse(fs.readFileSync(`./data/${filename}`))
};

let getEvents = function() {
  return read('events.json');
};

let setEvents = function(events) {
  return write('events.json', events);
};


let getAccessCode = function() {
  return read('accessCode.json');
};

let setAccessCode = function(accessCode) {
  if (typeof accessCode !== 'string')
    throw new Error('Not a string');

  write('accessCode.json', accessCode);
};


module.exports.getAccessCode = getAccessCode;
module.exports.setAccessCode = setAccessCode;
module.exports.getEvents = getEvents;
module.exports.setEvents = setEvents;