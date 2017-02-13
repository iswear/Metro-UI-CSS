/**
 * Created by iswear on 2017/1/23.
 */
$.widget("metro.layout", $.metro.plugin, {
    version: '3.0.0',

    options: {
        splitWidth: 1,
        minNorthHeight: 0,
        maxNorthHeight: Infinity,
        minSouthHeight: 0,
        maxSouthHeight: Infinity,
        minWestWidth: 0,
        maxWestWidth: Infinity,
        minEastWidth: 0,
        maxEastWidth: Infinity,
        onLayout: function () { return true; },
        onLayouted: null
    },

    _$center: null,
    _$north: null,
    _$east: null,
    _$south: null,
    _$west: null,
    _$split: null,
    _layoutParam: null,
    _splitParam: null,
    _create: function () {
        this._super();
        this.element.data("layout", this);
    },

    _init: function () {
        this._super();
        var element = this.element;
        var position = element.css("position");
        if (!(position == "absolute" || position == "relative" || position == "fixed")){
            element.css({
                "position": "relative"
            });
        }

        this._$center = element.children(".center");
        this._$north = element.children(".north");
        this._$east = element.children(".east");
        this._$south = element.children(".south");
        this._$west = element.children(".west");
        this._$split = element.children(".split");

        this._$center = this._$center.length > 0 ? $(this._$center.get(0)) : null;
        this._$north = this._$north.length > 0 ? $(this._$north.get(0)) : null;
        this._$east = this._$east.length > 0 ? $(this._$east.get(0)) : null;
        this._$south = this._$south.length > 0 ? $(this._$south.get(0)) : null;
        this._$west = this._$west.length > 0 ? $(this._$west.get(0)) : null;
        this._$split = this._$split.length > 0 ? $(this._$split.get(0)) : $('<div>').addClass("split").appendTo(element);

        this._layoutParam = {
            northHeight: (this._$north == null ? 0 : this._$north.outerHeight()),
            southHeight: (this._$south == null ? 0 : this._$south.outerHeight()),
            eastWidth: (this._$east == null ? 0 : this._$east.outerWidth()),
            westWidth: (this._$west == null ? 0 : this._$west.outerWidth())
        };
        this._splitParam = {
            type: 0,
            eventStartLeft: 0,
            eventStartTop: 0
        };
        var doc = this.document, win = this.window;
        this._on(element, {
            "mousedown": "_mousedownElement",
            "mousemove": "_mousemoveElement",
        });

        var doc = this.document;
        this._on($(doc), {
            "mousemove": "_mousemoveDocument",
            "mouseup": "_mouseupDocument"
        });

        this._on($(win), {
            "resize": "_layout"
        });
        this._layout();
    },

    _layout: function () {
        var options = this.options;
        if (typeof options.onLayout === 'function') {
            if (!options.onLayout()) {
                return;
            }
        }
        var splitWidth = options.splitWidth;
        var centerNorth = this._layoutParam.northHeight == 0 ? 0 : (this._layoutParam.northHeight + splitWidth);
        var centerEast = this._layoutParam.eastWidth == 0 ? 0 : (this._layoutParam.eastWidth + splitWidth);
        var centerSouth = this._layoutParam.southHeight == 0 ? 0 : (this._layoutParam.southHeight + splitWidth);
        var centerWest = this._layoutParam.westWidth == 0 ? 0 : (this._layoutParam.westWidth + splitWidth);
        if (this._$center != null) {
            this._$center.css({
                'top': centerNorth,
                'right': centerEast,
                'bottom': centerSouth,
                'left': centerWest
            });
        }
        if (this._$north != null) {
            this._$north.css({
                'height': this._layoutParam.northHeight
            });
        }
        if (this._$south != null) {
            this._$south.css({
                'height': this._layoutParam.southHeight
            });
        }
        if (this._$east != null) {
            this._$east.css({
                'top': centerNorth,
                'bottom': centerSouth,
                'width': this._layoutParam.eastWidth
            });
        }
        if (this._$west != null) {
            this._$west.css({
                'top': centerNorth,
                'bottom': centerSouth,
                'width': this._layoutParam.westWidth
            });
        }

        if (typeof options.onLayouted === 'function') {
            options.onLayouted();
        }
    },

    _checkSplitType: function (localX, localY, conWidth, conHeight) {
        var conHeight = this.element.innerHeight();
        var halfSplitWidth = this.options.splitWidth / 2;
        var decideWidth = halfSplitWidth < 3 ? 3 : halfSplitWidth;
        var decideTop = (halfSplitWidth - decideWidth);
        var decideBottom = (halfSplitWidth + decideWidth);
        if (this._$north != null &&
            localY >= this._layoutParam.northHeight + decideTop &&
            localY <= this._layoutParam.northHeight + decideBottom) {
            return 1;
        }
        if (this._$south != null &&
            localY >= conHeight - this._layoutParam.southHeight - decideBottom &&
            localY <= conHeight - this._layoutParam.southHeight - decideTop) {
            return 2;
        }
        if (this._$west != null &&
            localX >= this._layoutParam.westWidth + decideTop &&
            localX <= this._layoutParam.westWidth + decideBottom) {
            return 3;
        }
        if (this._$east != null &&
            localX >= conWidth - this._layoutParam.eastWidth - decideBottom &&
            localX <= conWidth - this._layoutParam.eastWidth - decideTop) {
            return 4;
        }
        return 0;
    },

    _mousedownElement: function (event) {
        this._splitParam.eventStartLeft = event.pageX;
        this._splitParam.eventStartTop = event.pageY;

        var pageOffset = $.domUtils.getElementPageOffset(this.element.get(0));
        var localX = event.pageX - pageOffset.left;
        var localY = event.pageY - pageOffset.top;

        var conHeight = this.element.innerHeight();
        var conWidth = this.element.innerWidth();

        this._splitParam.type = this._checkSplitType(localX, localY, conWidth, conHeight);

        var o = this.options;
        switch (this._splitParam.type) {
            case 1:{
                this._splitParam.splitStartVer = this._layoutParam.northHeight;
                this._$split.css({
                    "left": 0,
                    "top": this._splitParam.splitStartVer,
                    "right": 0,
                    "bottom": "auto",
                    "width": "auto",
                    "height": o.splitWidth,
                    "display": "block"
                });
                $.domUtils.getAndAppendAutoFullMask();
                break;
            }
            case 2:{
                this._splitParam.splitStartVer = this._layoutParam.southHeight;
                this._$split.css({
                    "left": 0,
                    "top": "auto",
                    "right": 0,
                    "bottom": this._splitParam.splitStartVer,
                    "width": "auto",
                    "height": o.splitWidth,
                    "display": "block"
                });
                $.domUtils.getAndAppendAutoFullMask();
                break;
            }
            case 3:{
                this._splitParam.splitStartHor = this._layoutParam.westWidth;
                this._splitParam.splitStartVer = this._layoutParam.northHeight + o.splitWidth;
                this._$split.css({
                    "left": this._splitParam.splitStartHor,
                    "top": this._splitParam.splitStartVer,
                    "right": "auto",
                    "bottom": (this._layoutParam.southHeight + o.splitWidth),
                    "width": o.splitWidth,
                    "height": "auto",
                    "display": "block"
                });
                $.domUtils.getAndAppendAutoFullMask();
                break;
            }
            case 4:{
                this._splitParam.splitStartHor = this._layoutParam.eastWidth;
                this._splitParam.splitStartVer = (this._layoutParam.northHeight + o.splitWidth);
                this._$split.css({
                    "left": "auto",
                    "top": this._splitParam.splitStartVer,
                    "right": this._splitParam.splitStartHor,
                    "bottom": this._layoutParam.southHeight + this.options.splitWidth,
                    "width": o.splitWidth,
                    "height": "auto",
                    "display": "block"
                });
                $.domUtils.getAndAppendAutoFullMask();
                break;
            }
            default:{
                break;
            }
        }
    },

    _mousemoveElement: function (event) {
        if (this._splitParam.type == 0) {
            var pageOffset = $.domUtils.getElementPageOffset(this.element.get(0));
            var localX = event.pageX - pageOffset.left;
            var localY = event.pageY - pageOffset.top;

            var conHeight = this.element.innerHeight();
            var conWidth = this.element.innerWidth();
            var type = this._checkSplitType(localX, localY, conWidth, conHeight);

            switch (type) {
                case 1: {
                    this.body.css({
                        "cursor": "ns-resize"
                    });
                    break;
                }
                case 2: {
                    this.body.css({
                        "cursor": "ns-resize"
                    });
                    break;
                }
                case 3: {
                    this.body.css({
                        "cursor": "ew-resize"
                    });
                    break;
                }
                case 4:{
                    this.body.css({
                        "cursor": "ew-resize"
                    })
                    break;
                }
                default:{
                    this.body.css({
                        "cursor": "default"
                    });
                    break;
                }
            }
        } else {
            event.preventDefault();
            event.stopPropagation();
        }
    },
    _mousemoveDocument: function (event) {
        console.log("hello world");
        switch (this._splitParam.type) {
            case 1: {
                var newTop = this._splitParam.splitStartVer + event.pageY - this._splitParam.eventStartTop;
                this._$split.css({
                    "top": newTop
                });
                break;
            }
            case 2: {
                var newBottom = this._splitParam.splitStartVer - (event.pageY - this._splitParam.eventStartTop);
                this._$split.css({
                    "bottom": newBottom
                });
                break;
            }
            case 3: {
                var newLeft = this._splitParam.splitStartHor + event.pageX - this._splitParam.eventStartLeft;
                this._$split.css({
                    "left": newLeft
                });
                break;
            }
            case 4: {
                var newRight = this._splitParam.splitStartHor - (event.pageX - this._splitParam.eventStartLeft);
                this._$split.css({
                    "right": newRight
                });
                break;
            }
            default: {
                break;
            }
        }
    },
    _mouseupDocument: function (event) {
        switch (this._splitParam.type) {
            case 1: {
                var offsetY = event.pageY - this._splitParam.eventStartTop;
                this._layoutParam.northHeight += offsetY;
                this._$split.css({
                    "display": "none"
                });
                this._layout();
                break;
            }
            case 2: {
                var offsetY = event.pageY - this._splitParam.eventStartTop;
                this._layoutParam.southHeight -= offsetY;
                this._$split.css({
                    "display": "none"
                });
                this._layout();
                break;
            }
            case 3: {
                var offsetX = event.pageX - this._splitParam.eventStartLeft;
                this._layoutParam.westWidth += offsetX;
                this._$split.css({
                    "display": "none"
                });
                this._layout();
                break;
            }
            case 4: {
                var offsetX = event.pageX - this._splitParam.eventStartLeft;
                this._layoutParam.eastWidth -= offsetX;
                this._$split.css({
                    "display": "none"
                });
                this._layout();
                break;
            }
            default: {
                break;
            }
        }
        this._splitParam.type = 0;
    },

    _setOption: function (key, value) {
        this._super(key, value);
        if (key === 'onLayout') {
            this.options.onLayout = this._checkEventFunc(this.options.onLayout);
        } else if (key === 'onLayouted') {
            this.options.onLayouted = this._checkEventFunc(this.options.onLayouted);
        }
    }

});