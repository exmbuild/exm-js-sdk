<p align="center">
<img src="https://avatars.githubusercontent.com/u/109497456?s=200&v=4" alt="3em Logo" width="110" height="110">
<h3 align="center">Execution Machine JS SDK</h3>

<p align="center">
    A Javascript SDK to interact with <a href="https://exm.dev">The Execution Machine (EXM)</a>
</p>
</p>

## General

EXM can be used through a JS SDK in order to perform operations with the platform. To install the SDK.

```shell
$ npm i @execution-machine/sdk
```

After installing the npm package as described above. You can initialize EXM by doing the following

```javascript
// import { Exm } from '@execution-machine/sdk'
const { Exm } = require('@execution-machine/sdk');

const exmInstance = new Exm({ token: 'MY_EXM_TOKEN' });
```

## Docs

Documentation for SDK is available online. Please [Click here](https://docs.exm.dev/trustless-serverless-functions/introduction/js-sdk) for more information. 