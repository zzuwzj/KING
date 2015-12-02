//  King.js 0.0.1

//  (c) 2015    Wang, Zhenjun

var define, require, use;
(function () {
  var moduleMap = {};
  var fileMap = {};

  var noop = function () {};

  var king = function () {};

  var core = {
    define: function (name, dependencies, factory) {
      if (!moduleMap[name]) {
        var module = {
          name: name,
          dependencies: dependencies,
          factory: factory
        };
        moduleMap[name] = module;
      }
      return moduleMap[name];
    },

    use: function (name) {
      var module = moduleMap[name];

      if (!module.entity) {
        var args = [];
        for (var i = 0; i < module.dependencies.length; i++) {
          if (moduleMap[module.dependencies[i]].entity) {
            args.push(moduleMap[module.dependencies[i]].entity);
          } else {
            args.push(this.use(module.dependencies[i]));
          }
        }

        module.entity = module.factory.apply(noop, args);
      }

      return module.entity;
    },

    require: function (pathArr, callback) {
      for (var i = 0; i < pathArr.length; i++) {
        var path = pathArr[i];

        if (!fileMap[path]) {
          var head = document.getElementsByTagName('head')[0];
          var node = document.createElement('script');
          node.type = 'text/javascript';
          node.async = 'true';
          node.src = path + '.js';
          node.onload = function () {
            fileMap[path] = true;
            head.removeChild(node);
            checkAllFiles();
          };
          head.appendChild(node);
        }
      }

      function checkAllFiles() {
        var allLoaded = true;
        for (var i = 0; i < pathArr.length; i++) {
          if (!fileMap[pathArr[i]]) {
            allLoaded = false;
            break;
          }
        }

        if (allLoaded) {
          callback();
        }
      }
    },

    error: function () {

    },

    log: function (obj) {
      try {
        console.log(obj);
      } catch (ex) {

      }
    }
  };

  var Events = {
    on: function (eventType, handler) {
      if (!this.eventMap) {
        this.eventMap = {};
      }

      //multiple event listener
      if (!this.eventMap[eventType]) {
        this.eventMap[eventType] = [];
      }
      this.eventMap[eventType].push(handler);
    },

    off: function (eventType, handler) {
      for (var i = 0; i < this.eventMap[eventType].length; i++) {
        if (this.eventMap[eventType][i] === handler) {
          this.eventMap[eventType].splice(i, 1);
          break;
        }
      };
    },

    fire: function (event) {
      var eventType = event.type;
      if (this.eventMap && this.eventMap[eventType]) {
        for (var i = 0; i < this.eventMap[eventType].length; i++) {
          this.eventMap[eventType][i](event);
        };
      }
    }
  };

  Object.extend = function (destination, source) {
    for (var property in source) {
      destination[property] = source[property];
    }
    return destination;
  }

  Object.extend(king, Events);
  Object.extend(king, core);

  //Events
  king.define("Events", [], function () {
    return Events;
  });

  window.king = king;
  define = king.define;
  require = king.require;
  use = king.use;

  king.on("ready", function () {
    king.require(["../src/modules/core/binding"], function () {
      var binding = king.use("DataBinding");
      binding.parse(document.body);
    })
  })
})();
