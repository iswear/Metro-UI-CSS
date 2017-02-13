$.widget( "metro.select" , $.metro.plugin, {

    version: "3.0.0",

    options: {
    },

    _create: function () {
        this._super();
        this.element.data('select', this);

    },

    _init: function () {
        this._super();
        var element = this.element, o = this.options;
        var func_options = [
            'templateResult',
            'templateSelection',
            'matcher',
            'initSelection',
            'query'
        ];

        func_options.map(function(func, index){
            if (o[func] !== undefined) {
                o[func] = window[o[func]];
            }
        });

        if (o.dropdownParent !== undefined) {
            o.dropdownParent = $(o.dropdownParent);
        }

        if($().select2) {
            try {
                element.find("select").select2(o);
            } catch (e) {

            }
        } else {
            console.log('You are trying to use support for Select2, but the plugin is not found!');
        }

    },

    _destroy: function () {
    },

    _setOption: function ( key, value ) {
        this._super(key, value);
    }
});
