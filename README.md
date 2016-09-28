# sails-hook-datadog
Overwrites sails.log.info, sails.log.error, and creates a sails.log.success

## Requirements

You need a datadog config in you sails app or else this hook will not work

config/datadog.js
```js
module.exports.datadog = {
  active: true,
  app_key: 'app_key',
  api_key: 'api_key'
};
```
