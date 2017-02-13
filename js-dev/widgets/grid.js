$.widget( "metro.grid" , $.metro.plugin, {

    version: "3.0.0",

    options: {
        equalHeight: true
    },

    _create: function () {
        this._super();
        this.element.data('grid', this);
    },

    _init: function () {
        this._super();
        var that = this, o = this.options;
        if (o.equalHeight) {
            setTimeout(function(){
                that._setEqualHeight();
            }, 50);

            $(window).on('resize', function(){
                that._setEqualHeight();
            });
        }
    },

    _setEqualHeight: function(){
        var element = this.element;
        var rows = element.find('.row');

        $.each(rows, function(){
            var row = $(this);
            var cells = row.children('.cell');
            var maxHeight = 0;

            cells.css('min-height', '0');

            $.each(cells, function(){
                //console.log(this.tagName, $(this).outerHeight());
                if ($(this).outerHeight() > maxHeight) {
                    maxHeight = $(this).outerHeight();
                }
            });

            cells.css('min-height', maxHeight);
        });
    },

    _destroy: function () {
    },

    _setOption: function ( key, value ) {
        this._super(key, value);
    }
});
