/*global king */
king.define("core.binding", [], function () {
  var Binder = {
    $watch: function (key, watcher) {
      if (!this.$watchers[key]) {
        this.$watchers[key] = {
          value: this[key],
          list: []
        };

        Object.defineProperty(this, key, {
          set: function (val) {
            var i, oldValue = this.$watchers[key].value;
            this.$watchers[key].value = val;

            for (i = 0; i < this.$watchers[key].list.length; i++) {
              this.$watchers[key].list[i](val, oldValue);
            }
          },

          get: function () {
            return this.$watchers[key].value;
          }
        });
      }

      this.$watchers[key].list.push(watcher);
    }
  };

  var changeHandlers = [];

  function parseElement(element, model) {
    var vm = model;

    if (element.getAttribute("king-bind-model")) {
      vm = bindModel(element.getAttribute("king-bind-model"));
    }

    var i;
    for (i = 0; i < element.attributes.length; i++) {
      parseAttribute(element, element.attributes[i], vm);
    }

    for (i = 0; i < element.children.length; i++) {
      parseElement(element.children[i], vm);
    }

    if (model !== vm) {
      for (var key in vm.$watchers) {
        vm[key] = vm.$watchers[key].value;
      }

      if (vm.$initializer) {
        vm.$initializer();
      }
    }
  }

  function parseAttribute(element, attr, model) {
    if (attr.name.indexOf("king-bind-") === 0) {
      var type = attr.name.slice(10);

      switch (type) {
      case "init":
        bindInit(element, attr.value, model);
        break;
      case "value":
        bindValue(element, attr.value, model);
        break;
      case "list":
        bindList(element, attr.value, model);
        break;
      case "click":
        bindClick(element, attr.value, model);
        break;
      case "enable":
        bindEnable(element, attr.value, model, true);
        break;
      case "disable":
        bindEnable(element, attr.value, model, false);
        break;
      case "visible":
        bindVisible(element, attr.value, model, true);
        break;
      case "invisible":
        bindVisible(element, attr.value, model, false);
        break;
      case "element":
        model[attr.value] = element;
        break;
      }
    }
  }

  function bindModel(name) {
    king.log("binding model: " + name);

    var model = king.use(name);
    var instance = new model();
    Object.extend(instance, Binder);
    // !!! cannot put the $watchers in Binder, here is just shallow copy, 
    // all instances will share one if put inside Binder
    instance.$watchers = {};

    return instance;
  }

  function bindValue(element, key, model) {
    king.log("binding value: " + key);

    model.$watch(key, function (value, oldValue) {
      element.value = value || "";
    });

    switch (element.tagName) {
    case "SELECT":
      {
        bindSelectValue(element, key, model);
        break;
      }
    default:
      {
        bindTextValue(element, key, model);
        break;
      }
    }

    function bindTextValue(el, key, model) {
      el.onkeyup = function () {
        model[key] = el.value;
        king.fire({
          type: "modelchange"
        });
      };

      el.onpaste = function () {
        model[key] = el.value;
        king.fire({
          type: "modelchange"
        });
      };
    }

    function bindSelectValue(el, key, model) {
      el.onchange = function () {
        model[key] = el.value;
        king.fire({
          type: "modelchange"
        });
      }
    }
  }

  function bindList(element, key, model) {
    king.log("binding list: " + key);

    model.$watch(key, function (value, oldValue) {
      var selectedValue = element.value;
      element.innerHTML = null;

      var i;
      for (i = 0; i < value.length; i++) {
        var item = document.createElement("option");
        item.innerHTML = value[i].label;
        item.value = value[i].key;

        element.appendChild(item);
      }
      element.value = selectedValue;
    });
  }

  function bindInit(element, key, model) {
    king.log("binding init: " + key);

    model.$initializer = (function (model) {
      return function () {
        model[key]();
        king.fire({
          type: "modelchange"
        });
      }
    })(model);
  }

  function bindClick(element, key, model) {
    king.log("binding click: " + key);

    element.onclick = function () {
      model[key]();
      king.fire({
        type: "modelchange"
      });
    };
  }

  function bindEnable(element, key, model, direction) {
    king.log("binding enable: " + key);

    if (typeof model[key] === "function") {
      changeHandlers.push(function () {
        element.style.disable = model[key]() ^ direction ? true : false;
      });
    } else {
      model.$watch(key, function (value, oldvalue) {
        element.disable = value ^ direction ? true : false;
      });
    }
  }

  function bindVisible(element, key, model, direction) {
    king.log("binding visible: " + key);

    if (typeof model[key] == "function") {
      changeHandlers.push(function () {
        element.style.display = model[key]() ^ direction ? "none" : "";
      });
    } else {
      model.$watch(key, function (value, oldValue) {
        element.style.display = value ^ direction ? "none" : "";
      });
    }
  }

  function apply() {
    var i;
    for (i = 0; i < changeHandlers.length; i++) {
      changeHandlers[i]();
    }
  }

  king.on("modelchange", function () {
    apply();
  });

  return {
    parse: parseElement
  };
});
