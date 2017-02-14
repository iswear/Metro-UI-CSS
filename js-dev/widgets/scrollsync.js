$.widget("metro.scrollsync", $.metro.plugin, {

    version: '1.0',
    options: {
        elements: "",
        direction: "both"
    },

    _create: function () {
        this._super();
        this.element.data("scrollsync", this);
    },

    _init: function () {
        this._super();
        var o = this.options, element = this.element;
        var direction = o.direction;
        var elements = element.find(o.elements);
        if (direction === "x") {
            this._on(elements, {
                "scroll": "_syncXScroll"
            });
        } else if (direction === "y") {
            this._on(elements, {
                "scroll": "_syncYScroll"
            });
        } else if (direction === "both") {
            this._on(elements, {
                "scroll": "_syncBothScroll"
            });
        }
    },

    _destory: function () {
        this._super();
    },

    _syncXScroll: function (e) {
        var target = $(e.currentTarget);
        var o = this.options, element = this.element;
        var elements = element.find(o.elements);
        var scrollLeft = target.scrollTop();
        for (var i = 0, len = elements.length; i < len; ++i) {
            if (target[0] !== elements[i]) {
                $(elements[i]).scrollLeft(scrollLeft);
            }
        }
    }

    ,

    _syncYScroll: function (e) {
        var target = $(e.currentTarget);
        var o = this.options, element = this.element;
        var elements = element.find(o.elements);
        var scrollTop = target.scrollTop();
        for (var i = 0, len = elements.length; i < len; ++i) {
            if (target[0] !== elements[i]) {
                $(elements[i]).scrollTop(scrollTop);
            }
        }
    },

    _syncBothScroll: function (e) {
        var target = $(e.currentTarget);
        var o = this.options, element = this.element;
        var elements = element.find(o.elements);
        var scrollLeft = target.scrollLeft();
        var scrollTop = target.scrollTop();
        for (var i = 0, len = elements.length; i < len; ++i) {
            if (target[0] !== elements[i]) {
                $(elements[i]).scrollLeft(scrollLeft).scrollTop(scrollTop);
            }
        }
    },

    _setOption: function (key, value) {

    }

});