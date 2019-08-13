requirejs.config({
  //By default load any module IDs from js/lib
  baseUrl: '/public/',
  //except, if the module ID starts with "app",
  //load it from the js/app directory. paths
  //config is relative to the baseUrl, and
  //never includes a ".js" extension since
  //the paths config could be for a directory.
  paths: {
    _setup: './_setup',
    result: './result',
    select: './select',
    transform: './transform',
    upload: './upload'
  }
});

// Start the main app logic.
require(['image.style'],
  function (imageStyle) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    angular.bootstrap(document.body, ['image.style']);
  });