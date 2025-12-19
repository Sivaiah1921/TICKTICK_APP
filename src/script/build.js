/* eslint-disable no-console */
const fsX = require('fs');
const { ncp } = require('ncp');
const path = require('path');

const args = process.argv;

ncp.limit = 16;

const srcPathConfig = `src/asset/config/${args[2]}`;
const srcPathIcons = 'src/asset/icons';
const destPath = 'build';

const buildApp = () => {
  console.log('> build stated...');
  let error = null;
  ncp(srcPathConfig, destPath, (err) => {
    if (err) {
      error = err;
    }
  });

  ncp(srcPathIcons, destPath, (err) => {
    if (err) {
      error = err;
    }
  });

  setTimeout(() => {
    if (error) {
      console.log('> build failed...');
    } else {
      console.log('> build completed...');
    }
  }, 10);
};

const directory = path.join(__dirname, '../../build');

const clearBuildDir = async (dirPath) => {
  try {
    fsX.rmSync(dirPath, { recursive: true, force: true });
    const folderName = path.join(__dirname, '../../build/.package');
    if (!fsX.existsSync(folderName)) {
      fsX.mkdirSync(folderName, { recursive: true, force: true });
    }
    if (args[2] === 'samsung') {
      const scriptFolder = path.join(__dirname, '../../build/js');
      if (!fsX.existsSync(scriptFolder)) {
        fsX.mkdirSync(scriptFolder, { recursive: true, force: true });
      }
    }
  } catch (err) {
    console.log('> Clear packaging...', err);
  }
};

clearBuildDir(directory).then(() => {
  console.log('> Removed pervious build files...');
  buildApp();
});
