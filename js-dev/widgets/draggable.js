$.widget( "metro.draggable" , $.metro.plugin, {

    version: "3.0.0",

    options: {
        dragElement: null,
        dragArea: null,
        dragCursor: 'move',
        zIndex: 2000,
        onDragStart: function(e, el){},
        onDragStop: function(e, el){},
        onDragMove: function(e, el, offset){ return true; }
    },

    _drag: false,
    _oldCursor: null,
    _oldZindex: null,
    _oldPosition: null,
    _dragArea: null,
    _dragElement: null,
    _dragRunStatus: null,


    _create: function () {
        this._super();
        this.element.data('draggable', this);
    },

    _init: function () {
        this._super();

        var element = this.element, o = this.options;
        this._dragElement = o.dragElement ? element.find(o.dragElement) : element;
        this._dragArea = o.dragArea ? $(o.dragArea) : $(window);
        this._dragRunStatus = {
            os: {
                left: 0,
                top: 0,
            },
            pos: {
                x: 0,
                y: 0
            }
        }
        this._on(this._dragElement, {
            "mouseover": "_mouseoverDragElement",
            "mousedown": "_mousedownDragElement"
        });
        this._on(this.document,{
            "mousemove": "_mousemoveDocument",
            "mouseup": "_mouseupDocument"
        });
        addTouchEvents(element[0]);
    },

    _mouseoverDragElement: function (e) {
        var o = this.options;
        if (o.dragCursor) {
            var $target = $(e.currentTarget);
            $target.css({
                "cursor": o.dragCursor
            })
        }
    },

    _mousedownDragElement: function (e) {
        var element = this.element, o = this.options;
        this._drag = true;

        if (typeof o.onDragStart === 'function') {
            o.onDragStart(e, element);
        }

        this._oldZindex= element.css('z-index');
        element.css({
            'z-index': o.zIndex
        });


        this._dragRunStatus.os.left =  o.dragArea ? this._dragArea.offset().left : 0;
        this._dragRunStatus.os.top = o.dragArea ? this._dragArea.offset().top : 0;
        this._dragRunStatus.pos.x = element.offset().left - e.pageX;
        this._dragRunStatus.pos.y = element.offset().top - e.pageY;

        $.domUtils.getAndAppendAutoFullMask(o.dragCursor ? o.dragCursor : this._dragElement.css("cursor"));
    },

    _mousemoveDocument: function (e) {
        if (!this._drag) return false;
7
        var element = this.element, o = this.options;
        var pageX = e.pageX - this._dragRunStatus.os.left;
        var pageY = e.pageY - this._dragRunStatus.os.top;

        var offset = {
            top: pageY + this._dragRunStatus.pos.y,
            left: pageX + this._dragRunStatus.pos.x
        };

        var t_delta = this._dragArea.innerHeight() + this._dragArea.scrollTop() - element.outerHeight();
        var l_delta = this._dragArea.innerWidth() + this._dragArea.scrollLeft() - element.outerWidth();



        if (offset.top !== undefined) {
            if (offset.top < 0) {
                offset.top  = 0;
            } else if (offset.top > t_delta) {
                offset.top = t_delta;
            }
            element.offset({top: offset.top + this._dragRunStatus.os.top});
        }
        if (offset.left !== undefined) {
            if (offset.left < 0) {
                offset.left = 0;
            } else if (offset.left > l_delta) {
                offset.left = l_delta;
            }
            element.offset({left: offset.left + this._dragRunStatus.os.left});
        }
        if (typeof o.onDragMove === 'function') {
            if (!o.onDragMove(e, element, offset)) {
                return;
            }
        }
        if (offset.top != undefined) {
            element.offset({top: offset.top + this._dragRunStatus.os.top});
        }
        if (offset.left != undefined) {
            element.offset({left: offset.left + this._dragRunStatus.os.left});
        }

    },

    _mouseupDocument: function (e) {
        if (this._drag) {
            this._drag = false;
            var o = this.options, element = this.element;
            element.css({
                'z-index': this._oldZindex
            });
            if (typeof o.onDragStop === 'function') {
                o.onDragStop(e, element);
            }
        }
    },

    _destroy: function () {
    },

    _setOption: function ( key, value ) {
        this._super(key, value);
        if (key === 'onDragStart') {
            this.options.onDragStart = this._checkEventFunc(this.options.onDragStart);
        } else if (key === 'onDragMove') {
            this.options.onDragMove = this._checkEventFunc(this.options.onDragMove);
        } else if (key === 'onDragStop') {
            this.options.onDragStop = this._checkEventFunc(this.options.onDragStop);
        }
    }
});
