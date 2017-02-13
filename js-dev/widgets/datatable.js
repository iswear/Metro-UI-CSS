$.widget( "metro.datatable" , $.metro.plugin, {

    version: "3.0.0",

    options: {
    },

    _create: function () {
        this._super();
        this.element.data('datatable', this);
    },

    _init: function () {
        this._super();
        var element = this.element, o = this.options;

        if($().dataTable) {
            try {
                element.dataTable(o);
            } catch (e) {

            }
        } else {
            alert('dataTable plugin required');
        }
    },

    _destroy: function () {
    },

    _setOption: function ( key, value ) {
        this._super(key, value);
    }
});
