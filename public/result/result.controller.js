define(['_setup/angular-core-object'], function (CoreObject) {
    return CoreObject.extend({

      init: ['$state', function ($state) {
        this.$state = $state;
        this.localStorage = localStorage;
        this.convertedPic = this.loadConvertedPic();
        this.showResult = !!this.convertedPic.id;
      }],
  
      loadConvertedPic: function () {
        if (this.localStorage.getItem('convertedPic')) {
          return JSON.parse(this.localStorage.getItem('convertedPic'));
        } else {
          return {id: null, url: ''};
        }
      },

      goToTransform: function () {
        this.$state.go('transform');
      }
    });
  });