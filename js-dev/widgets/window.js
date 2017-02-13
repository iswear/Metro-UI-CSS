$.widget( "metro.window" , $.metro.plugin, {

    version: "3.0.0",

    options: {
        parent: 'default',
        captionStyle: false,
        contentStyle: false,
        buttons: {
            btnMin: false,
            btnMax: false,
            btnClose: false
        },
        title: false,
        content: false,
        icon: false,
        type: 'default', // 'modal'
        size: false, // {width: x, height: y}

        onBtnMinClick: function(e){e.preventDefault();},
        onBtnMaxClick: function(e){e.preventDefault();},
        onBtnCloseClick: function(e){e.preventDefault();},
        onShow: function(e){e.preventDefault();},
        onHide: function(e){e.preventDefault();}
    },

    _create: function () {
        this._super();
        this.element.data('window', this);

    },

    _init: function () {
        this._super();
        this._createWindow();
    },

    _createWindow: function(){
        var element = this.element, o = this.options;
        var wind = element, capt, cont;

        wind.addClass("window");
        capt = $("<div/>").addClass("window-caption");
        cont = $("<div/>").addClass("window-content");

        if (o.icon || o.title) {capt.appendTo(wind);}
        cont.appendTo(wind);

        if (typeof o.size === 'object') {
            $.each(o.size, function(key, value){
                cont.css(key, value);
            });
        }

        if (o.captionStyle && typeof o.captionStyle === 'object') {
            $.each(o.captionStyle, function(key, value){
                if (metroUtils.isColor(value)) {
                    capt.css(key, value + " !important");
                } else {
                    capt.addClass(value);
                }
            });
        }

        if (o.contentStyle && typeof o.contentStyle === 'object') {
            $.each(o.contentStyle, function(key, value){
                if (metroUtils.isColor(value)) {
                    cont.css(key, value + " !important");
                } else {
                    cont.addClass(value);
                }
            });
        }

        wind.appendTo(o.parent !== 'default' ? o.parent : element.parent());

        this.icon();
        this.title();
        this.buttons();
        this.content();
    },

    icon: function(){
        var o = this.options;
        var capt = this.element.children('.window-caption');
        var icon = capt.find(".window-caption-icon");

        if (o.icon) {
            if (icon.length === 0) {
                $("<span/>").addClass('window-caption-icon').html(o.icon).appendTo(capt);
            } else {
                icon.html(o.icon);
            }

        }
    },

    title: function(){
        var o = this.options;
        var capt = this.element.children('.window-caption');
        var title = capt.find(".window-caption-title");

        if (o.title) {
            if (title.length === 0) {
                $("<span/>").addClass('window-caption-title').html(o.title).appendTo(capt);
            } else {
                title.html(o.title);
            }
        }
    },

    buttons: function(){
        var o = this.options;
        var bMin, bMax, bClose;
        var capt = this.element.children('.window-caption');

        if (capt.length === 0) {return;}

        if (o.buttons) {
            var btnMin = o.buttons.btnMin;
            var btnMax = o.buttons.btnMax;
            var btnClose = o.buttons.btnClose;

            if (btnMin && btnMin !== false) {
                bMin = $("<span/>").addClass('btn-min').appendTo(capt);
                if (typeof btnMin === 'object') {
                    bMin.css(btnMin);
                }

                this._on(btnMin, {
                    "click": "_clickBtnMin"
                });
            }

            if (btnMax && btnMax !== false) {
                bMax = $("<span/>").addClass('btn-max').appendTo(capt);
                if (typeof btnMax === 'object') {
                    bMax.css(btnMax);
                }
                this._on(btnMax, {
                    "click": "_clickBtnMax"
                });

            }

            if (btnClose && btnClose !== false) {
                bClose = $("<span/>").addClass('btn-close').appendTo(capt);
                if (typeof btnClose === 'object') {
                    bClose.css(btnClose);
                }
                this._on(btnClose, {
                    "click": "_clickBtnClose"
                });
            }
        }
    },

    content: function(){
        var o = this.options;
        var c = o.content;
        var content = this.element.children('.window-content');

        if (!c) {return;}

        if (metroUtils.isUrl(c)) {
            if (c.indexOf('youtube') > -1) {
                var iframe = $("<iframe>");
                var video_container = $("<div/>").addClass('video-container').appendTo(content);

                iframe
                    .attr('src', c)
                    .attr('frameborder', '0');

                iframe.appendTo(video_container);
            }
        } else {
            content.html(c);
        }
    },

    _clickBtnMin: function (event) {
        var options = this.options;
        if (typeof options.onBtnMinClick === 'function') {
            options.onBtnMinClick(event);
        }
    },

    _clickBtnMax: function (event) {
        var options = this.options;
        if (typeof options.onBtnMaxClick === 'function') {
            options.onBtnMaxClick(event);
        }
    },

    _clickBtnClose: function (event) {
        var options = this.options;
        if (typeof options.onBtnCloseClick === 'function') {
            options.onBtnCloseClick(event);
        }
    },

    _destroy: function () {
    },

    _setOption: function ( key, value ) {
        this._super(key, value);
        if (key === 'onBtnMinClick') {
            this.options.onBtnMinClick = this._checkEventFunc(this.options.onBtnMinClick);
        } else if (key === 'onBtnMaxClick') {
            this.options.onBtnMaxClick = this._checkEventFunc(this.options.onBtnMaxClick);
        } else if (key === 'onBtnCloseClick') {
            this.options.onBtnCloseClick = this._checkEventFunc(this.options.onBtnCloseClick);
        } else if (key === 'onShow') {
            this.options.onShow = this._checkEventFunc(this.options.onShow);
        } else if (key === 'onHide') {
            this.options.onHide = this._checkEventFunc(this.options.onHide);
        }
    }
});
