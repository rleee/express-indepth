function consoleLog(req, res, next) {
  console.log(Date.now() + ': console log middleware called');
  next();
}

module.exports = {
  consoleLog: consoleLog
};
