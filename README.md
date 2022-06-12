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
*This will eventually support building for all OSs but testing is currently incomplete.*

The following commands will build an OSX DMG if run on mac. *It should build for linux or windows if run on their respective machines but it is still untested.*
    
    npm run build
    npm run make

To build linux zip installer on any system with `docker` run the following command which will build a docker image and container and put the .zip in the local `./out` folder via volume. It will delete the docker container and image after build.

    ./build-linux.sh

Or run the following to save the container and image for inspection.

    ./build-linux.sh --save-artifacts

#### User guide
To run the application you will need an IPFS node to connect to, the easiest way to connect to run one is with [IPFS Desktop](https://docs.ipfs.io/install/ipfs-desktop/).

##### usage
* Click the `settings` tab to connect to an IPFS instance *(the default address is the IPFS desktop default)*.
* Click on the `editor` navigation tab and fill out the form with metadata and your article text. 
* Use the `save` button to save a draft to your local hard drive or click `publish` to pin the file to your local IPFS node.
    * Click the `random` buttons to fill out forms with random data for testing.


##### reference

[icns convert](https://cloudconvert.com/png-to-icns) (for making osx application icon)

##### known issues
- navigation is adding redundant listeners on each page load, example error msg:

        MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 navigate-to listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit

- using legacy ssl in `build-linux` command, see [reference](https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported).