/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const fs = require('fs');
const jsdom = require('jsdom');

const { smScript } = require('./js/main');

// const { secretKey } = require('../utils/encrypt');

const { JSDOM } = jsdom;
require('dotenv').config();

const args = process.argv;

const APP = args[2];

const { REACT_LG_APP_WEB_URL, REACT_SAMSUNG_APP_WEB_URL } = process.env;

const getAppURL = (url) => String(url);
// const keyURL = `?secretKey=${secretKey(process.env)}`;
// if (APP === 'lg') {
//   return String(url).concat(keyURL);
// }
// return String(url).concat(keyURL);

const generateScriptForSamsung = () => {
  fs.writeFile('build/js/main.js', smScript(REACT_SAMSUNG_APP_WEB_URL), (error) => {
    if (error) {
      console.error('> failed to generate HTML', error);
    } else {
      console.log('> completed HTML generate...');
    }
  });
};

const generateScript = () => {
  const appURL = getAppURL(REACT_LG_APP_WEB_URL);
  return `
      function processParams(params) {
          if (params && params.detail && params.detail.target) {
              // Only navigate if the domain matches
              let expectedDomain = '${appURL}'.split('?')[0];
              if (params.detail.target.indexOf(expectedDomain) >= 0) {
                  location.href = params.detail.target;
              } else {
                  console.warn('Unsupported URL provided, re-directing to Home page');
                  location.href = '${appURL}';
              }
          } else {
              location.href = '${appURL}';
          }
      }

      function registerDeepLink() {
        document.addEventListener('webOSLaunch', processParams);
        document.addEventListener('webOSRelaunch', processParams);
      }
    `;
};

JSDOM.fromFile(`src/generator/${APP}/generate.html`).then((dom) => {
  console.log('> started to genarating HTML');
  const { document } = dom.window;
  if (APP === 'lg') {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = generateScript();
    document.body.appendChild(script);
  } else {
    // const srcArray = [`${SAMSUNG_APP_WEB_URL}assets/path.js`, `${SAMSUNG_APP_WEB_URL}webOS.js`, `${SAMSUNG_APP_WEB_URL}webOSTV-dev.js`];
    const srcArray = [`${REACT_SAMSUNG_APP_WEB_URL}assets/path.js`];
    for (let i = 0; i < srcArray.length; i++) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = srcArray[i];
      document.head.appendChild(script);
    }
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = `${REACT_SAMSUNG_APP_WEB_URL}asset-manifest.json`;
    document.head.appendChild(link);
    generateScriptForSamsung();
  }

  fs.writeFile('build/index.html', dom.serialize(), (error) => {
    if (error) {
      console.error('> failed to generate HTML', error);
    } else {
      console.log('> completed HTML generate...');
    }
  });
});
