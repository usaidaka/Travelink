import CryptoJS, { AES } from 'crypto-js';

import config from '@config/index';

const decryptPayload = (data) => {
  try {
    if (typeof data === 'object') {
      console.log('obj');
      data = JSON.stringify(data);
      const decrypted = AES.decrypt(data, config.encryption.cryptoSecret).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    }
    if (typeof data === 'string') {
      const decrypted = AES.decrypt(data, config.encryption.cryptoSecret).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    }
  } catch (error) {
    throw new Error(`Gagal mendekripsi data: ${error.message}`);
  }
};

export default decryptPayload;
