const CryptoJS = require('crypto-js');

const secretKey = ({ SECRET_KEY, SECRET_VALUE }) => {
  const cipherText = CryptoJS.AES.encrypt(SECRET_VALUE, SECRET_KEY).toString();
  return cipherText;
};

exports.secretKey = secretKey;
