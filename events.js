const EventEmitter = require('events');
const messageEmitter = new EventEmitter();

messageEmitter.on('message_call', (message) => {
    console.log('Je suis message emetteur ', message);
})

module.exports = messageEmitter;