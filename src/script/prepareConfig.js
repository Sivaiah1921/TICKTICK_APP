/* eslint-disable no-console */
const { ncp } = require('ncp');

ncp.limit = 16;

const srcPathConfig = 'src/asset/config/samsung/config.xml';

const CopyConfig = () => {
  console.log('> copy  stated...');
  let error = null;
  ncp(`config.${process.env.REACT_APP_NODE_ENV}.xml`, srcPathConfig, (err) => {
    if (err) {
      error = err;
    }
  });

  setTimeout(() => {
    if (error) {
      console.log('> copy failed...');
    } else {
      console.log('> copy completed...');
    }
  }, 10);
};

CopyConfig();
