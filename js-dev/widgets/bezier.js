$.widget("metro.bezier", $.metro.plugin, {
    version: '1.0.0',

    options: {
        srcPoint: {
            left: 0,
            top: 0
        },
        desPoint: {
            left: 100,
            top: 100
        },
        srcCtrlPoint: {
            left: 0,
            top: 0
        },
        desCtrlPoint: {
            left: 100,
            top: 100
        },
        onChange: function () { return true; },
    },

    _$svg: null,
    _$svgPath: null,
    _$srcCtrl: null,
    _$desCtrl: null,
    
    _create: function () {
        this._super();
        var that = this, o = this.options, element = this.element;
        this._$svg = element.children("svg");
        if (this._$svg.length == 0) {
            this._$svg = $.domUtils.createSvg("svg");
            this._$svgPath = $.domUtils.createSvg("path");
            this._$svg.append(this._$svgPath).appendTo(element);
        } else {
            this._$svg = $(this._$svg.get(0));
            this._$svgPath = this._$svg.children("path");
            if (this._$svgPath.length == 0) {
                this._$svgPath = $.domUtils.createSvg("path")
            } else {
                this._$svgPath = $(this._$svgPath.get(0));
            }
        }
        this._$svgPath.css({
            'stroke': 'black',
            'stroke-width': '1',
            'fill': 'none'
        });
        this._$srcCtrl = $("<span>").addClass("ctrl").css({
            "background-color": "#0f0"
        }).draggable({
            onDragMove: function (e, el, offset) {
                if (typeof o.onChange === 'function') {
                    if (!o.onChange()) {
                        return;
                    }
                }

                var p2 = that._$srcCtrl.position();
                o.srcCtrlPoint.left = p2.left + 4;
                o.srcCtrlPoint.top = p2.top + 4;
                that._paintBezier();
            }
        }).appendTo(element);

        this._$desCtrl = $("<span>").addClass("ctrl").css({
            "background-color": "#00f"
        }).draggable({
            onDragMove: function (e, el, offset) {
                if (typeof o.onChange === 'function') {
                    if (!o.onChange()) {
                        return;
                    }
                }
                var p3 = that._$desCtrl.position();
                o.desCtrlPoint.left = p3.left + 4;
                o.desCtrlPoint.top = p3.top + 4;
                that._paintBezier();
            }
        }).appendTo(element);
        this.element.data("bezier", this);
    },

    _init: function () {
        this._super();
        this.loadBezier();
    },

    loadBezier: function (srcPoint, desPoint, srcCtrlPoint, desCtrlPoint) {
        var o = this.options;
        if (arguments.length == 4) {
            o.srcPoint.left = srcPoint.left;
            o.srcPoint.top = srcPoint.top;
            o.desPoint.left = desPoint.left;
            o.desPoint.top = desPoint.top;
            o.srcCtrlPoint.left = srcCtrlPoint.left;
            o.srcCtrlPoint.top = srcCtrlPoint.top;
            o.desCtrlPoint.left = desCtrlPoint.left;
            o.desCtrlPoint.top = desCtrlPoint.top;
        }

        this._$srcCtrl.css({
            "left": o.srcCtrlPoint.left - 4,
            "top": o.srcCtrlPoint.top - 4
        });
        this._$desCtrl.css({
            "left": o.desCtrlPoint.left - 4,
            "top": o.desCtrlPoint.top - 4
        });
        this._paintBezier();
    },

    _paintBezier: function () {
        var o = this.options;
        var cmd = "M " + o.srcPoint.left + " " + o.srcPoint.top
            + " Q " + o.srcCtrlPoint.left + " " +  o.srcCtrlPoint.top
            + " " + o.desCtrlPoint.left + " " + o.desCtrlPoint.top
            + " T " + o.desPoint.left + " " + o.desPoint.top;
        this._$svgPath.attr("d", cmd);
    },

    _setOption: function (key, value) {
        this._super(key, value);
        if (key === 'onChange') {
            this.options.onChange = this._checkEventFunc(this.options.onChange);
        } else if (key === 'srcPoint') {
            this.loadBezier();
        } else if (key === 'desPoint') {
            this.loadBezier();
        } else if (key === 'srcCtrlPoint') {
            this.loadBezier();
        } else if (key === 'desCtrlPoint') {
            this.loadBezier();
        }
    }
});