# dBranch Desktop
This is a desktop application to write and publish [dBranch.news](dBranch.news) articles into IPFS. The GUI is created with `react`, it uses the `electron` desktop framework and `electron-forge` for packaging.

#### Development
##### setup

    git clone https://github.com/b-rad-c/dbranch-desktop.git
    cd dbranch-desktop
    npm install
    npm start

The electron framework code is in the `./public` folder and the react renderer code is in the `./src` folder.

##### packaging

    npm run build
    npm run make

#### User guide
To run the application you will need an IPFS node to connect to, the easiest way to connect to run one is with [IPFS Desktop](https://docs.ipfs.io/install/ipfs-desktop/).

##### usage
* Click the `settings` tab to connect to an IPFS instance *(the default address is the IPFS desktop default)*.
* Click on the `editor` navigation tab and fill out the form with metadata and your article text. 
* Use the `save` button to save a draft to your local hard drive or click `publish` to pin the file to your local IPFS node.
    * Click the `random` buttons to fill out forms with random data for testing.


##### reference
icns convert: https://cloudconvert.com/png-to-icns
https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3

##### known bugs
navigation is adding redundant listeners on each page load, example error msg:

    MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 navigate-to listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit