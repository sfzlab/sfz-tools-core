# sfz-tools-core
![Test](https://github.com/kmturley/sfz-tools-core/actions/workflows/test.yml/badge.svg)

Common methods package shared across SFZ command line tool, website and web player. Handles parsing and converting SFZ files using:

* NodeJS 12.x
* TypeScript 4.x


## Installation

To install the common package, run the command:

    npm install @sfz-tools/core


## Usage

Import the package using:

    import { convertSfzToJson, convertSfzToXml } from '@sfz-tools/core';

Then use the available methods as normal.


## Deployment

Release an updated version on npm by simply creating a version tag:

    npm version patch
    git push && git push origin --tags

Then publish to npm using:

    npm publish


## Contact

For more information please contact kmturley
