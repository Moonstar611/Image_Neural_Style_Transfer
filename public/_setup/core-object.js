define([], function () {
  'use strict';
  var env = (typeof window !== 'undefined' && window) ||
    (typeof process !== 'undefined' && process.env) ||
    {};

  function deprecation(msg) {
    if (env.CORE_OBJECT_WARN_DEPRECATED) {
      var error = new Error();
      var stack = error.stack.split(/\n/);
      var source = stack[3];
      console.warn('Deprecation: ' + msg + '\n' + source);
    }
  };

  // var assignProperties = require('./lib/assign-properties');
  function setPrototypeOf(obj, proto) {
    Object.setPrototypeOf ? Object.setPrototypeOf(obj, proto) : obj.__proto__ = proto;
  }

  function getPrototypeOf(obj, proto) {
    return Object.getPrototypeOf ? Object.getPrototypeOf(obj) : obj.__proto__;
  }

  function giveMethodSuper(superclass, name, fn) {
    return function () {
      var superFn;

      if (superclass[name]) {
        superFn = function () {
          return superclass[name].apply(this, arguments);
        };
      } else {
        superFn = function () {
        };
      }

      // #yolo
      setPrototypeOf(superFn, superclass);
      superFn.apply = Function.prototype.apply;
      superFn.call = Function.prototype.call;
      superFn.bind = Function.prototype.bind;
      superFn[name] = superclass[name] || function () {
      };

      var previous = this._super;
      this._super = superFn;
      var ret = fn.apply(this, arguments);
      this._super = previous;
      return ret;
    };
  }

  var sourceAvailable = (function () {
    return this;
  }).toString().indexOf('return this;') > -1;

  var hasSuper;
  if (sourceAvailable) {
    hasSuper = function (fn) {
      if (fn.__hasSuper === undefined) {
        return fn.__hasSuper = fn.toString().indexOf('_super') > -1;
      } else {
        return fn.__hasSuper;
      }
    };
  } else {
    hasSuper = function (target, fn) {
      return true;
    };
  }

  function assignProperties(target, options) {
    var value;

    for (var key in options) {
      value = options[key];

      if (typeof value === 'function' && hasSuper(value)) {
        target[key] = giveMethodSuper(getPrototypeOf(target), key, value);
      } else {
        target[key] = value;
      }
    }
  }

  // core-object
  function needsNew() {
    throw new TypeError('Failed to construct: Please use the \'new\' operator, this object constructor cannot be called as a function.');
  }

  function CoreObject(options) {
    if (!(this instanceof CoreObject)) {
      needsNew();
    }
    this.init(options);
  }

  CoreObject.prototype.init = function (options) {
    if (options) {
      for (var key in options) {
        this[key] = options[key];
      }
    }
  };

  CoreObject.extend = function (options) {
    var constructor = this;

    function Class() {
      var length = arguments.length;

      if (length === 0) {
        this.init();
      } else if (length === 1) {
        this.init(arguments[0]);
      } else {
        this.init.apply(this, arguments);
      }
    }

    Class.__proto__ = CoreObject;

    Class.prototype = Object.create(constructor.prototype);

    if (options) {
      if (shouldCallSuper(options.init)) {
        deprecation(
          'Overriding init without calling this._super is deprecated. ' +
          'Please call this._super.apply(this, arguments).'
        );
        options.init = forceSuper(options.init);
      }
      assignProperties(Class.prototype, options);
    }

    return Class;
  };

  /* global define:true module:true window: true */
  // if (typeof define === 'function' && define['amd'])      { define(function() { return
  // CoreObject; }); } if (typeof module !== 'undefined' && module['exports']) { module['exports']
  // = CoreObject; } if (typeof window !== 'undefined')                      { window['CoreObject']
  // = CoreObject; }

  function shouldCallSuper(fn) {
    // No function, no problem
    if (!fn) {
      return false;
    }

    // Takes arguments, assume disruptive override
    if (/^function *\( *[^ )]/.test(fn)) {
      return false;
    }

    // Calls super already, good to go
    if (/this\._super\(/.test(fn)) {
      return false;
    }
    if (/this\._super\./.test(fn)) {
      return false;
    }

    return true;
  }

  function forceSuper(fn) {
    return function () {
      this._super.apply(this, arguments);
      fn.apply(this, arguments);
    }
  }

  return CoreObject;
});