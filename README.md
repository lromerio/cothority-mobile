[![Build Status](https://travis-ci.org/lromerio/cothority-mobile.svg?branch=master)](https://travis-ci.org/lromerio/cothority-mobile) [![Coverage Status](https://coveralls.io/repos/github/lromerio/cothority-mobile/badge.svg?branch=master)](https://coveralls.io/github/lromerio/cothority-mobile?branch=master)

# CothorityMobile
EPFL Bachelor Project, Spring 2017.

A mobile application developed with [PhoneGap][phonegap], it allows to manage SSH-keys using the [cothority-framework][cothority].

### Installation
First install [npm][npm], then run `npm i` to install dependencies and `npm i -g phonegap` to install PhoneGap.
 
### Run
[Here][tutorial] you find the official tutorial which explains how to preview a PhoneGap application on a real device.

Alternatively - if you are using an Android device - you can directly install the _cothority_mobile-debug.apk_ on your phone.

### Features
- Overview conode status
- Add device to an existing access-control-list (via qr-code)
- Overview all devices and data stored in an access-control-list
- Vote on proposal
- Make proposition

### Requirements
- Camera permission
- A running Cothority

[phonegap]: https://phonegap.com/
[cothority]: https://github.com/dedis/cothority
[npm]: https://www.npmjs.com/get-npm?utm_source=house&utm_medium=homepage&utm_campaign=free%20orgs&utm_term=Install%20npm
[tutorial]: http://docs.phonegap.com/getting-started/1-install-phonegap/cli/
