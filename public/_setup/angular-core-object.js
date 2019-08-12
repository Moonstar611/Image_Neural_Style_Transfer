define(['./core-object'], function(CoreObject) {
    function AngularCoreObject(options) {
        CoreObject.call(this, options);
    }

    AngularCoreObject.prototype = CoreObject.prototype;

    AngularCoreObject.extend = function(options) {
        if (Array.isArray(options.init)) {
            var annotations = options.init.slice(0, -1);
            var initFn = options.init[options.init.length-1];
            options.init = initFn;
        }

        var constructorFn = CoreObject.extend(options);
        constructorFn.$inject = annotations;
        return constructorFn;
    }

    window.CoreObject = {
        extend: function() {
            throw new Error("Require and use angular-core-object, not CoreObject.");
        }
    };

    return AngularCoreObject;
});