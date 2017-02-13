$.widget("metro.imageCutter", $.metro.plugin, {
    version: '1.0.0',

    options: {
        src: "",
        onChanged: null,
        onOk: function () {
            return true;
        },
        onCancel: function () {
            return true;
        }
    },
    _zone: null,
    _cutRunStatus: null,
    _zoneDetailPanel: null,
    _$cancelBtn: null,
    _$image: null,
    _$imageContainer: null,
    _$maskTop: null,
    _$maskRight: null,
    _$maskBottom: null,
    _$maskLeft: null,
    _$maskCenter: null,
    _$ctrlTop: null,
    _$ctrlRight: null,
    _$ctrlBottom: null,
    _$ctrlLeft: null,
    _$ctrlLeftTop: null,
    _$ctrlLeftBottom: null,
    _$ctrlRightTop: null,
    _$ctrlRightBottom: null,

    _create: function () {
        this._super();
        var element = this.element;
        this._zone = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
        this._cutRunStatus = {
            isAdjusting: false,
            isDrawing: false,
            drawStartOff: {left: 0, top: 0}
        };
        this._zoneDetailPanel = {
            $panel: null,
            $leftValue: null,
            $topValue: null,
            $widthValue: null,
            $heightValue: null
        };
        this._$imageContainer = element.children(".image-container");
        if (this._$imageContainer.length == 0) {
            this._$imageContainer = $("<div>").addClass("image-container").appendTo(element);
            this._$image = $("<img>").appendTo(this._$imageContainer);
        } else {
            this._$imageContainer = $(this._$imageContainer.get(0));
            this._$image = this._$imageContainer.children("img");
            if (this._$image.length == 0) {
                this._$image = $("<img>").appendTo(this._$imageContainer);
            }
        }
        this._$maskTop = $("<div>").addClass("select-mask").appendTo(this._$imageContainer);
        this._$maskRight = $("<div>").addClass("select-mask").appendTo(this._$imageContainer);
        this._$maskBottom = $("<div>").addClass("select-mask").appendTo(this._$imageContainer);
        this._$maskLeft = $("<div>").addClass("select-mask").appendTo(this._$imageContainer);
        this._$maskCenter = $("<div>").addClass("select-mask-center").appendTo(this._$imageContainer);
        this._$ctrlTop = $("<span>").addClass("select-ctrl").appendTo(this._$imageContainer);
        this._$ctrlRight = $("<span>").addClass("select-ctrl").appendTo(this._$imageContainer);
        this._$ctrlBottom = $("<span>").addClass("select-ctrl").appendTo(this._$imageContainer);
        this._$ctrlLeft = $("<span>").addClass("select-ctrl").appendTo(this._$imageContainer);
        this._$ctrlLeftTop = $("<span>").addClass("select-ctrl").appendTo(this._$imageContainer);
        this._$ctrlRightTop = $("<span>").addClass("select-ctrl").appendTo(this._$imageContainer);
        this._$ctrlRightBottom = $("<span>").addClass("select-ctrl").appendTo(this._$imageContainer);
        this._$ctrlLeftBottom = $("<span>").addClass("select-ctrl").appendTo(this._$imageContainer);
        this._zoneDetailPanel.$panel = $('<div class="zone-detail-panel"> ' +
            '<header>参数面板 </header> ' +
            '<ul class="content"> ' +
            '<li> ' +
            '<span class="title">左:</span> ' +
            '<span class="value">0px</span> ' +
            '<span class="btn plus"></span> ' +
            '<span class="btn minus"></span> ' +
            '</li> ' +
            '<li> ' +
            '<span class="title">上:</span> ' +
            '<span class="value">0px</span> ' +
            '<span class="btn plus"></span> ' +
            '<span class="btn minus"></span> ' +
            '</li> ' +
            '<li> ' +
            '<span class="title">宽:</span> ' +
            '<span class="value">0px</span> ' +
            '<span class="btn plus"></span> ' +
            '<span class="btn minus"></span> ' +
            '</li> ' +
            '<li> ' +
            '<span class="title">高:</span> ' +
            '<span class="value">0px</span> ' +
            '<span class="btn plus"></span> ' +
            '<span class="btn minus"></span> ' +
            '</li> ' +
            '</ul> ' +
            '<footer> ' +
            '<button class="button success mini-button">确认</button> ' +
            '<button class="button danger mini-button">取消</button> ' +
            '</footer> ' +
            '</div>').appendTo(element).hide();
        var $detailPanelLis = this._zoneDetailPanel.$panel.children('.content').children("li");
        for (var i = 0, len = $detailPanelLis.length; i < len; ++i) {
            var $curLi = $($detailPanelLis[i]);
            if (i == 0) {
                this._zoneDetailPanel.$leftValue = $curLi.children(".value");
            } else if (i == 1) {
                this._zoneDetailPanel.$topValue = $curLi.children(".value");
            } else if (i == 2) {
                this._zoneDetailPanel.$widthValue = $curLi.children(".value");
            } else if (i == 3) {
                this._zoneDetailPanel.$heightValue = $curLi.children(".value");
            }
        }
    },

    _init: function () {
        this._super();
        this._exitCutting();
        var that = this, element = this.element;
        this._$ctrlTop.draggable({
            dragArea: this._$imageContainer,
            dragCursor: "ns-resize",
            onDragMove: function (e, el, offset) {
                if (offset.top + 3 > that._zone.bottom) {
                    offset.top = that._zone.bottom - 3;
                }
                offset.left = undefined;
                if (offset.top >= 0) {
                    that._zone.top = offset.top + 3;
                }
                that._layoutCtrlsAndMasks();
                return true;
            }
        });
        this._$ctrlRight.draggable({
            dragArea: this._$imageContainer,
            dragCursor: "ew-resize",
            onDragMove: function (e, el, offset) {
                if (offset.left + 3 < that._zone.left) {
                    offset.left = that._zone.left - 3;
                }
                offset.top = undefined;
                if (offset.left >= 0) {
                    that._zone.right = offset.left + 3;
                }
                that._layoutCtrlsAndMasks();
                return true;
            }
        });
        this._$ctrlBottom.draggable({
            dragArea: this._$imageContainer,
            dragCursor: "ns-resize",
            onDragMove: function (e, el, offset) {
                if (offset.top + 3 < that._zone.top) {
                    offset.top = that._zone.top - 3;
                }
                offset.left = undefined;
                if (offset.top >= 0) {
                    that._zone.bottom = offset.top + 3;
                }
                that._layoutCtrlsAndMasks();
                return true;
            }
        });
        this._$ctrlLeft.draggable({
            dragArea: this._$imageContainer,
            dragCursor: "ew-resize",
            onDragMove: function (e, el, offset) {
                if (offset.left + 3 > that._zone.right) {
                    offset.left = that._zone.right - 3;
                }
                offset.top = undefined;
                if (offset.left >= 0) {
                    that._zone.left = offset.left + 3;
                }
                that._layoutCtrlsAndMasks();
                return true;
            }
        });
        this._$ctrlLeftTop.draggable({
            dragArea: this._$imageContainer,
            dragCursor: "nw-resize",
            onDragMove: function (e, el, offset) {
                if (offset.top + 3 > that._zone.bottom) {
                    offset.top = that._zone.bottom - 3;
                }
                if (offset.left + 3 > that._zone.right) {
                    offset.left = that._zone.right - 3;
                }
                if (offset.top >= 0) {
                    that._zone.top = offset.top + 3;
                }
                if (offset.left >= 0) {
                    that._zone.left = offset.left + 3;
                }
                that._layoutCtrlsAndMasks();
                return true;
            }
        });
        this._$ctrlRightTop.draggable({
            dragArea: this._$imageContainer,
            dragCursor: "ne-resize",
            onDragMove: function (e, el, offset) {
                if (offset.top + 3 > that._zone.bottom) {
                    offset.top = that._zone.bottom;
                }
                if (offset.left + 3 < that._zone.left) {
                    offset.left = that._zone.left
                }
                if (offset.top >= 0) {
                    that._zone.top = offset.top + 3;
                }
                if (offset.left >= 0) {
                    that._zone.right = offset.left + 3;
                }
                that._layoutCtrlsAndMasks();
                return true;
            }
        });
        this._$ctrlRightBottom.draggable({
            dragArea: this._$imageContainer,
            dragCursor: "se-resize",
            onDragMove: function (e, el, offset) {
                if (offset.top + 3 < that._zone.top) {
                    offset.top = that._zone.top - 3;
                }
                if (offset.left + 3 < that._zone.left) {
                    offset.left = that._zone.left - 3;
                }
                if (offset.top >= 0) {
                    that._zone.bottom = offset.top + 3;
                }
                if (offset.left >= 0) {
                    that._zone.right = offset.left + 3;
                }
                that._layoutCtrlsAndMasks();
                return true;
            }
        });
        this._$ctrlLeftBottom.draggable({
            dragArea: this._$imageContainer,
            dragCursor: "sw-resize",
            onDragMove: function (e, el, offset) {
                if (offset.top < that._zone.top) {
                    offset.top = that._zone.top;
                }
                if (offset.left > that._zone.right) {
                    offset.left = that._zone.right;
                }
                if (offset.top >= 0) {
                    that._zone.bottom = offset.top;
                }
                if (offset.left >= 0) {
                    that._zone.left = offset.left;
                }
                that._layoutCtrlsAndMasks();
                return true;
            }
        });
        this._$maskCenter.draggable({
            dragArea: this._$imageContainer,
            onDragMove: function (e, el, offset) {
                if (offset.top >= 0) {
                    that._zone.bottom = that._zone.bottom - that._zone.top + offset.top;
                    that._zone.top = offset.top;
                }
                if (offset.left >= 0) {
                    that._zone.right = that._zone.right - that._zone.left + offset.left;
                    that._zone.left = offset.left;
                }
                that._layoutCtrlsAndMasks();
                return true;
            }
        });

        this._on(this._$imageContainer, {
            "mousedown": "_mousedownContainer"
        });

        this._on(this.document, {
            "mousemove": "_mousemoveDocument",
            "mouseup": "_mouseupDocument"
        });


        this._zoneDetailPanel.$panel.draggable({
            dragArea: element,
            dragElement: this._zoneDetailPanel.$panel.children("header")
        });

        this._on(this._zoneDetailPanel.$panel.children("footer").children(".success"), {
            "click": "_clickOkBtn"
        });

        this._on(this._zoneDetailPanel.$panel.children("footer").children(".danger"), {
            "click": "_clickCancelBtn"
        });

        this._on(this._zoneDetailPanel.$leftValue.siblings(".btn"),{
            "click": "_clickLeftValueBtn"
        });

        this._on(this._zoneDetailPanel.$topValue.siblings(".btn"), {
            "click": "_clickTopValueBtn"
        });

        this._on(this._zoneDetailPanel.$widthValue.siblings(".btn"), {
            "click": "_clickWidthValueBtn"
        });

        this._on(this._zoneDetailPanel.$heightValue.siblings(".btn"), {
            "click": "_clickHeightValueBtn"
        });

    },

    _mousedownContainer: function (e) {
        if (!this._cutRunStatus.isAdjusting && !this._cutRunStatus.isDrawing) {
            var offset = this._$imageContainer.offset();
            var left = e.pageX - offset.left;
            var top = e.pageY - offset.top;

            this._cutRunStatus.drawStartOff.left = left;
            this._cutRunStatus.drawStartOff.top = top;

            this._zone.top = top;
            this._zone.right = left;
            this._zone.bottom = top;
            this._zone.left = left;

            this._cutRunStatus.isDrawing = true;
            this._showMasks();
            this._layoutCtrlsAndMasks();
        }
    },

    _mousemoveDocument: function (e) {
        if (this._cutRunStatus.isDrawing) {
            var offset = this._$imageContainer.offset();
            var left = e.pageX - offset.left;
            var top = e.pageY - offset.top;
            if (left > this._cutRunStatus.drawStartOff.left) {
                this._zone.left = this._cutRunStatus.drawStartOff.left;
                this._zone.right = left;
            } else {
                this._zone.left = left;
                this._zone.right = this._cutRunStatus.drawStartOff.left;
            }
            if (top > this._cutRunStatus.drawStartOff.top) {
                this._zone.top = this._cutRunStatus.drawStartOff.top;
                this._zone.bottom = top;
            } else {
                this._zone.top = top;
                this._zone.bottom = this._cutRunStatus.drawStartOff.top;
            }
            this._layoutCtrlsAndMasks();
        }
    },
    
    _mouseupDocument: function (e) {
        if (this._cutRunStatus.isDrawing) {
            this._cutRunStatus.isDrawing = false;
            this._cutRunStatus.isAdjusting = true;
            this._showCtrls();
        }
    },

    _clickOkBtn: function (e) {
        var o = this.options;
        if (typeof o.onOk === 'function') {
            if (o.onOk(e)) {
                this._exitCutting();
            }
        }
    },

    _clickCancelBtn: function (e) {
        var o = this.options;
        if (typeof o.onCancel === 'function') {
            if (o.onCancel(e)) {
                this._exitCutting();
            }
        }
    },

    _clickLeftValueBtn: function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass("plus")) {
            this._zone.left += 1;
            this._zone.right += 1;
        } else if (target.hasClass("minus")) {
            this._zone.left -= 1;
            this._zone.right -= 1;
        }
        this._layoutCtrlsAndMasks();
    },

    _clickTopValueBtn: function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass("plus")) {
            this._zone.top += 1;
            this._zone.bottom += 1;
        } else if (target.hasClass("minus")) {
            this._zone.top -= 1;
            this._zone.bottom -= 1;
        }
        this._layoutCtrlsAndMasks();
    },

    _clickWidthValueBtn: function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass("plus")) {
            this._zone.right += 1;
        } else if (target.hasClass("minus")) {
            this._zone.right -= 1;
        }
        this._layoutCtrlsAndMasks();
    },

    _clickHeightValueBtn: function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass("plus")) {
            this._zone.bottom += 1;
        } else if (target.hasClass("minus")) {
            this._zone.bottom -= 1;
        }
        this._layoutCtrlsAndMasks();
    },


    _layoutCtrlsAndMasks: function () {
        var top = this._zone.top;
        var right = this._zone.right;
        var bottom = this._zone.bottom;
        var left = this._zone.left;
        this._zoneDetailPanel.$leftValue.text(left + "px");
        this._zoneDetailPanel.$widthValue.text((right - left) + "px");
        this._zoneDetailPanel.$topValue.text(top + "px");
        this._zoneDetailPanel.$heightValue.text((bottom - top) + "px");
        this._$maskTop.css({
            "top": 0,
            "right": 0,
            "left": 0,
            "height": top
        });
        this._$maskRight.css({
            "top": top,
            "right": 0,
            "left": right,
            "height": bottom - top
        });
        this._$maskBottom.css({
            "top": bottom,
            "right": 0,
            "bottom": 0,
            "left": 0
        });
        this._$maskLeft.css({
            "top": top,
            "left": 0,
            "width": left,
            "height": bottom - top
        });
        this._$maskCenter.css({
            "top": top,
            "left": left,
            "width": (right - left),
            "height": (bottom - top)
        });
        top = top - 3;
        right = right - 3;
        bottom = bottom - 3;
        left = left - 3;
        this._$ctrlTop.css({
            "left": (left + right) / 2,
            "top": top
        });
        this._$ctrlRight.css({
            "left": right,
            "top": (top + bottom) / 2
        });
        this._$ctrlBottom.css({
            "left": (left + right) / 2,
            "top": bottom
        });
        this._$ctrlLeft.css({
            "left": left,
            "top": (top + bottom) / 2
        });
        this._$ctrlLeftTop.css({
            "left": left,
            "top": top
        });
        this._$ctrlRightTop.css({
            "left": right,
            "top": top
        });
        this._$ctrlRightBottom.css({
            "left": right,
            "top": bottom
        });
        this._$ctrlLeftBottom.css({
            "left": left,
            "top": bottom
        });
    },

    _showCtrls: function () {
        this._zoneDetailPanel.$panel.css({
            "left": 10,
            "top": 10
        }).show();
        this._$ctrlTop.css({
            "display": "block"
        });
        this._$ctrlRight.css({
            "display": "block"
        });
        this._$ctrlBottom.css({
            "display": "block"
        });
        this._$ctrlLeft.css({
            "display": "block"
        });
        this._$ctrlLeftTop.css({
            "display": "block"
        });
        this._$ctrlLeftBottom.css({
            "display": "block"
        });
        this._$ctrlRightTop.css({
            "display": "block"
        });
        this._$ctrlRightBottom.css({
            "display": "block"
        });
        this._layoutCtrlsAndMasks();
    },

    _hideCtrls: function () {
        this._zoneDetailPanel.$panel.hide();
        this._$ctrlTop.css({
            "display": "none"
        });
        this._$ctrlRight.css({
            "display": "none"
        });
        this._$ctrlBottom.css({
            "display": "none"
        });
        this._$ctrlLeft.css({
            "display": "none"
        });
        this._$ctrlLeftTop.css({
            "display": "none"
        });
        this._$ctrlLeftBottom.css({
            "display": "none"
        });
        this._$ctrlRightTop.css({
            "display": "none"
        });
        this._$ctrlRightBottom.css({
            "display": "none"
        });
    },
    
    _showMasks: function () {
        this._$maskTop.css({
            "display": "block"
        });
        this._$maskRight.css({
            "display": "block"
        });
        this._$maskBottom.css({
            "display": "block"
        });
        this._$maskLeft.css({
            "display": "block"
        });
        this._$maskCenter.css({
            "display": "block"
        })
        this._layoutCtrlsAndMasks();
    },
    
    _hideMasks: function () {
        this._$maskTop.css({
            "display": "none"
        });
        this._$maskRight.css({
            "display": "none"
        });
        this._$maskBottom.css({
            "display": "none"
        });
        this._$maskLeft.css({
            "display": "none"
        });
        this._$maskCenter.css({
            "display": "none"
        });
    },


    _exitCutting: function () {
        this._cutRunStatus.isAdjusting = false;
        this._cutRunStatus.isDrawing = false;
        this._hideMasks();
        this._hideCtrls();
    },

    _setOption: function (key, value) {
        this._super();
        if (key === "src") {
            this._$image.attr("src", value);
            this._exitCutting();
        } else if (key === "onChanged") {
            this.options.onChanged = this._checkEventFunc(this.options.onChanged);
        } else if (key === 'onOk') {
            this.options.onOk = this._checkEventFunc(this.options.onOk);
        } else if (key === 'onCancel') {
            this.options.onCancel = this._checkEventFunc(this.options.onCancel);
        }
    }

});