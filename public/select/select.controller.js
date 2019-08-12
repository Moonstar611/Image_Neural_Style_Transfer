define(['_setup/angular-core-object'], function(CoreObject) {
    return CoreObject.extend({
        
        init: ["$state", "$cookies", function ($state, $cookies) {
            this.PIC_URL_TEMPLATE = '/modules/images/style_templates/';
            this.$state = $state;
            this.$cookies = $cookies;
            this.localStorage = localStorage;
            this.selections = [
                {name: "Stary Night - Van Gogh", id: 0, url: this.PIC_URL_TEMPLATE + "stary_night.jpg"},
                {name: "Impression, Sunrise - Claude Monet", id: 1, url: this.PIC_URL_TEMPLATE + "sun_rise.jpg"},
                {name: "Liberty Leading The People - Eugene Delacroix", id: 2, url: this.PIC_URL_TEMPLATE + "liberty_leading_the_people.jpg"},
                {name: "Girl Before A Mirror - Pablo Picasso", id: 3, url: this.PIC_URL_TEMPLATE + "girl_before_a_mirror.jpg"}
            ];
            this.tempPicSelection = this.loadTempPicSelection();
            this.curSelectionId = this.tempPicSelection.id;
        }],

        saveTempPicSelection: function() {
            this.tempPicSelection = {
                id: this.curSelectionId,
                url: this.selections[this.curSelectionId].url
            }
            this.localStorage.setItem('tempPicSelection', JSON.stringify(this.tempPicSelection));
        },

        loadTempPicSelection: function() {
            if (this.localStorage.getItem('tempPicSelection')) {
                return JSON.parse(this.localStorage.getItem('tempPicSelection'));
            } else {
                return {id: 0, url: this.selections[0].url};
            }
        },

        showPic: function(id) {
            return id == this.curSelectionId;
        },

        goToUpload: function() {
            this.saveTempPicSelection();
            this.$state.go('upload');
        }

    });
});