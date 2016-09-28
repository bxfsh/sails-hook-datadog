
module.exports = function (sails) {

  return {

    /**
     * Intialise the hook
     */
    initialize: function(cb) {
      sails.log.info('[sails-hook-datadog] Initialising'.green);
      return cb();
    },

    /**
     * Configure the hook
     */
    configure: () => {

      // getting name and version from the parent package.json
      var package = require('../../../package.json')
      var name = package.name;
      var version = package.version;
      var hostName = os.hostname();
      var tags = [
        `${name}_${sails.config.env}`,
        `host: ${hostName}`,
        `version: ${version}`
      ];

      /**
       * Initialise datadog API
       * @return {[type]} [description]
       */
      var initialiseDataDogApi = function initialiseDataDogApi() {
        datadog.initialize(sails.config.datadog);
      };

      /**
       * Override the sails.log.error
       * @return {[type]} [description]
       */
      var overrideErrorLog = function overrideErrorLog() {

        var errorLogMessage = sails.log.error;
        sails.log.error = function() {
          var args = [(new Date().toISOString() + ':').red];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          };

          errorLogMessage.apply(this, args);

          // sending datadog event if active
          if (sails.config.datadog.active) {
            var title =  `ERROR: ${name} ${sails.config.env}`;
            var text = JSON.stringify(args) + (new Error().stack);
            var properties = {
              tags: tags,
              alert_type: 'error'
            };
            datadog.event.create(title, text, properties, function(err, res) { });
          }

        };

      };

      /**
       * adding winston to the sails info logs
       * @return {[type]} [description]
       */
      var overrideInfoLog = function overrideInfoLog() {

        var infoLogMessage = sails.log.info;
        sails.log.info = function() {

          var args = [(new Date().toISOString() + ':').cyan];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          };
          infoLogMessage.apply(this, args);

          // sending datadog event if active
          if (sails.config.datadog.active) {
            var title =  `INFO: ${name} ${sails.config.env}`;
            var text = JSON.stringify(args) + (new Error().stack);
            var properties = {
              tags: tags,
              alert_type: 'info'
            };
            datadog.event.create(title, text, properties, function(err, res){ });
          }

        };

      };

      var createSuccessLog = function createSuccessLog() {

        sails.log.success = function() {

          var args = [(new Date().toISOString() + ':').cyan];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          };

          // sending datadog event if active
          if (sails.config.datadog.active) {
            var title = `SUCCESS: ${name} ${sails.config.env}`;
            var text = JSON.stringify(args);
            var properties = {
              tags: tags,
              alert_type: 'success'
            };
            datadog.event.create(title, text, properties, function(err, res){ });
          }

        };

      };

      sails.on('lifted', function() {

        console.log('Boxfish \\o/'.rainbow);

        initialiseDataDogApi();
        overrideErrorLog();
        overrideInfoLog();
        createSuccessLog();
      });

    }

  }

};