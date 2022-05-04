# dBranch Desktop

#### setup
Clone this repository and then:

    npm install
    npm start

#### requirements
You need an IPFS node to connect to, the easiest way to connect to run one is with [IPFS Desktop](https://docs.ipfs.io/install/ipfs-desktop/).

#### usage
* Click the `settings` tab to connect to an IPFS instance *(the default address is the IPFS desktop default)*.
* Click on the `editor` navigation tab and fill out the form with metadata and your article text. 
* Use the `save` button to save a draft to your local hard drive or click `publish` to pin the file to your local IPFS node.
    * Click the `random` buttons to fill out forms with random data for testing purposes


##### reference
icns convert: https://cloudconvert.com/png-to-icns
https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3

##### known bugs
navigation is adding redundant listeners on each page load, example error msg:

    MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 navigate-to listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit