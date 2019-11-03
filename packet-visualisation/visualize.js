const colors = require('./colors');

const PACKET_SIZE = 3;
const random = max => Math.floor(Math.random() * max);

let retries = 0;

const printData = (data, start, end) => {
  let output = '';
  for (let i = 0; i < data.length; i++) {
    if (start <= i && i < end) {
      output += colors.red(data[i] || ' ');
    } else {
      output += data[i] || ' ';
    }
  }
  console.clear();
  console.log(retries, output);
};

const receiver = {
  buffer: null,
  connect() {
    this.buffer = null;
  },
  header(length) {
    this.buffer = new Array(length);
  },
  receive(payload, index) {
    return new Promise((resolve, reject) => {
      // random rejection
      if (random(10) < 5) {
        return reject();
      }

      // update the internal buffer
      for (let i = 0; i < payload.length; i++) {
        this.buffer[index + i] = payload[i];
      }

      // debug output
      printData(this.buffer, index, index + payload.length);

      resolve();
    });
  }
};

const sender = {
  send(text) {
    const bytes = text.split('');

    receiver.connect();
    receiver.header(bytes.length);

    for (let i = 0; i < bytes.length; i += PACKET_SIZE) {
      const payload = bytes.slice(i, i + PACKET_SIZE);
      this.retry(payload, i);
    }
  },

  retry(payload, index) {
    setTimeout(() => {
      receiver.receive(payload, index).catch(() => {
        retries++;
        this.retry(payload, index);
      });
    }, 500 + random(500));
  }
};

sender.send('The quick brown fox jumps over the lazy dog');
