# sails-hook-datadog
Overwrites sails.log.info, sails.log.error, and creates a sails.log.success

## Installation

``` bash
npm i https://github.com/bxfsh/sails-hook-datadog.git --save
```

## Configuration

You need a datadog config in you sails app or else this hook will not work

config/datadog.js
```js
module.exports.datadog = {
  active: true,
  app_key: 'app_key',
  api_key: 'api_key'
};
```
## Usage

If active in the configuration file any `sails.log.info()`, `sails.log.error()`, or
`sails.log.success()` will be sent to datadog.
