const crypto = require('crypto');
const { IN_KOREAN } = require('./ERROR').WRONG_PASSWORD;
const hashFun = 'sha512';
const outputType = 'base64';

const encodePassword = (password) => {
  const isNotKorean = RegExp('^[a-zA-Z0-9]*$');
  if (!isNotKorean) throw IN_KOREAN;

  return crypto.createHash(hashFun).update(password).digest(outputType);
}

module.exports = encodePassword;