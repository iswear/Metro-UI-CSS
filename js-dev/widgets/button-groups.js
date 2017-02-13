$.widget( "metro.group" , $.metro.plugin, {

    version: "3.0.0",

    options: {
        groupType: 'one-state', // 'multi-state'
        buttonStyle: false,
        onChange: function(index, btn){return true;}
    },

    _create: function () {
        this._super();
        this.element.data('group', this);
    },

    _init: function () {
        this._super();
        var element = this.element, o = this.options;
        var result;

        if (!element.hasClass('group-of-buttons')) {
            element.addClass('group-of-buttons');
        }

        var buttons = element.find('.button, .toolbar-button');

        for(var i = 0; i < buttons.length; i++) {
            $(buttons[i]).data('index', i);
        }

        if (o.buttonStyle !== false) {
            buttons.addClass(o.buttonStyle);
        }

        element.on('click', '.button, .toolbar-button', function(){

            var button = $(this), index = button.data('index');

            if (typeof o.onChange === 'function') {
                if (!o.onChange(index, button)) {
                    return;
                }
            }

            if (o.groupType === 'one-state') {
                buttons.removeClass('active');
                $(this).addClass('active');
            } else  {
                $(this).toggleClass('active');
            }

        });
    },

    _setOption: function (key, value) {
        this._super(key, value);
        if (key === 'onChange') {
            this.options.onChange = this._checkEventFunc(this.options.onChange);
        }
    },
    
    _destroy: function () {
    }

});
