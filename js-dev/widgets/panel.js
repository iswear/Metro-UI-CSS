$.widget("metro.panel", $.metro.plugin, {

    version: "3.0.0",

    options: {
        onExpand: function(panel){},
        onCollapse: function(panel){}
    },

    _create: function(){
        this._super();
        this.element.data('panel', this);
    },

    _init: function () {
        this._super();
        var element = this.element, o = this.options;
        if (!element.hasClass('collapsible')) {element.addClass('collapsible');}

        if (element.hasClass("collapsible")) {
            var toggle = element.children(".heading");
            var content = element.children(".content");

            toggle.on("click", function(){
                var result;

                if (element.hasClass("collapsed")) {
                    content.slideDown('fast', function(){
                        element.removeClass('collapsed');
                        if (typeof o.onExpand === 'function') {
                            o.onExpand(element);
                        }
                    });
                } else {
                    content.slideUp('fast', function(){
                        element.addClass('collapsed');
                        if (typeof o.onCollapse === 'function') {
                            o.onCollapse(element);
                        }
                    });
                }

            });
        }
    },

    _destroy: function(){

    },

    _setOption: function(key, value){
        this._super(key, value);
        if (key === 'onCollapse') {
            this.options.onCollapse = this._checkEventFunc(this.options.onCollapse);
        } else if (key === 'onExpand') {
            this.options.onExpand = this._checkEventFunc(this.options.onExpand);
        }
    }
});
