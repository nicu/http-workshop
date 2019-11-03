const Reset = '\x1b[0m';

const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

module.exports = {
  black: text => `${FgBlack}${text}${Reset}`,
  red: text => `${FgRed}${text}${Reset}`,
  green: text => `${FgGreen}${text}${Reset}`,
  yellow: text => `${FgYellow}${text}${Reset}`,
  blue: text => `${FgBlue}${text}${Reset}`,
  magenta: text => `${FgMagenta}${text}${Reset}`,
  cyan: text => `${FgCyan}${text}${Reset}`,
  white: text => `${FgWhite}${text}${Reset}`
};
