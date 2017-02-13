$.widget( "metro.plugin" , {

    version: '3.0.0',
    options: {
        css: null
    },
    _create: function () {
        this._setOptionsFromDOM();
        this.body = $(this.document.get(0).body);
        var element = this.element;
        if (this.options.css) {
            element.css(this.options.css);
        }
        var role = element.data("role");
        if (!role || role == '') {
            element.attr("data-role", this.widgetName);
        }
    },
    _init: function () {
        this._setOptions(this.options);
    },
    _setOptionsFromDOM: function(){
        var element = this.element, o = this.options;
        $.each(element.data(), function(key, value){
            if (key in o) {
                try {
                    o[key] = $.parseJSON(value);
                } catch (e) {
                    o[key] = value;
                }
            }
        });
    },
    _checkEventFunc: function (onFunc) {
        if (onFunc) {
            var win = this.window;
            if (typeof onFunc == 'function') {
                return onFunc;
            } else {
                if (typeof win[onFunc] === 'function') {
                    return win[onFunc];
                } else {
                    return eval("(function(){ " + onFunc + " })")
                }
            }
        } else {
            return null;
        }
    },

    _destory: function () {
        this._super();
        delete this.body;
    }

});
