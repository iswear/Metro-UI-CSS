$.widget("metro.accordion", $.metro.plugin, {

    version: "3.0.0",

    options: {
        closeAny: false,
        speed: 'fast',
        onFrameOpen: function(frame){return true;},
        onFrameClose: function(frame){return true;}
    },

    _create: function(){
        this._super();
        this.element.data('accordion', this);
    },

    _init: function(){
        this._super();
        var that = this, element = this.element;

        element.on('click', '.heading', function(e){
            var frame = $(this).parent();

            if (frame.hasClass('disabled')) {return false;}

            if  (!frame.hasClass('active')) {
                that._openFrame(frame);
            } else {
                that._closeFrame(frame);
            }

            e.preventDefault();
            e.stopPropagation();
        });
    },

    _closeAllFrames: function(){
        var that = this;
        var frames = this.element.children('.frame.active');
        $.each(frames, function(){
            that._closeFrame($(this));
        });
    },

    _openFrame: function(frame){
        var o = this.options;
        var content = frame.children('.content');

        if (typeof o.onFrameOpen === 'function') {
            if (!o.onFrameOpen(frame)) {
                return false;
            }
        }

        if (o.closeAny) {this._closeAllFrames();}

        content.slideDown(o.speed);
        frame.addClass('active');
    },

    _closeFrame: function(frame){
        var o = this.options;
        var content = frame.children('.content');

        if (typeof o.onFrameClose === 'function') {
            if (!o.onFrameClose(frame)) {
                return false;
            }
        }

        content.slideUp(o.speed,function(){
            frame.removeClass("active");
        });

    },

    _destroy: function(){
    },

    _setOption: function(key, value){
        this._super(key, value);
        if (key === 'onFrameOpen') {
            this.options.onFrameOpen = this._checkEventFunc(this.options.onFrameOpen);
        } else if (key === 'onFrameClose') {
            this.options.onFrameClose = this._checkEventFunc(this.options.onFrameClose);
        }
    }
});
