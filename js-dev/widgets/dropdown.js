$.widget("metro.dropdown", $.metro.plugin, {

    version: "3.0.0",

    options: {
        effect: window.METRO_SHOW_TYPE,
        toggleElement: false,
        noClose: false,
        onDrop: function(object){ return true; },
        onUp: function(object){ return true; }
    },

    _create: function(){
        this._super();
        this.element.data('dropdown', this);
    },

    _init: function () {
        this._super();
        var  that = this, element = this.element, o = this.options,
            menu = this.element,
            name = this.name,
            parent = this.element.parent();

        var toggle;

        toggle = o.toggleElement ? $(o.toggleElement) : parent.children('.dropdown-toggle').length > 0 ? parent.children('.dropdown-toggle') : parent.children('a:nth-child(1)');

        if (METRO_SHOW_TYPE !== undefined) {
            this.options.effect = METRO_SHOW_TYPE;
        }

        toggle.on('click.'+name, function(e){
            parent.siblings(parent[0].tagName).removeClass("active-container");
            $(".active-container").removeClass("active-container");

            if (menu.css('display') === 'block' && !menu.hasClass('keep-open')) {
                that._close(menu);
            } else {
                $('[data-role=dropdown]').each(function(i, el){
                    if (!menu.parents('[data-role=dropdown]').is(el) && !$(el).hasClass('keep-open') && $(el).css('display') === 'block') {
                        that._close(el);
                    }
                });
                if (menu.hasClass('horizontal')) {
                    menu.css({
                        'visibility': 'hidden',
                        'display': 'block'
                    });
                    var item_length = $(menu.children('li')[0]).outerWidth();
                    //var item_length2 = $(menu.children('li')[0]).width();
                    menu.css({
                        'visibility': 'visible',
                        'display': 'none'
                    });
                    var menu_width = menu.children('li').length * item_length + (menu.children('li').length - 1);
                    menu.css('width', menu_width);
                }
                that._open(menu);
                parent.addClass("active-container");
            }
            e.preventDefault();
            e.stopPropagation();
        });

        if (o.noClose === true) {
            element.on('click', function (e) {
                // e.preventDefault();
                e.stopPropagation();
            });
        }

        $(menu).find('li.disabled a').on('click', function(e){
            e.preventDefault();
        });
    },

    _open: function(el){
        var o = this.options;
        if (typeof o.onDrop === 'function') {
            if (!o.onDrop(el)) {
                return;
            }
        }
        var parent = this.element.parent();
        var toggle = o.toggleElement ? $(o.toggleElement) : parent.children('.dropdown-toggle').length > 0 ? parent.children('.dropdown-toggle') : parent.children('a:nth-child(1)');

        switch (this.options.effect) {
            case 'fade': $(el).fadeIn('fast'); break;
            case 'slide': $(el).slideDown('fast'); break;
            default: $(el).show();
        }
        this._trigger("onOpen", null, el);
        toggle.addClass('active-toggle');

        if (typeof o.onDrop === 'function') {
            o.onDrop(el);
        }
    },

    _close: function(el){
        var o = this.options;
        if (typeof o.onUp === 'function') {
            if (!o.onUp(el)) {
                return;
            }
        }
        var parent = $(el).parent();
        var toggle = o.toggleElement ? $(o.toggleElement) : parent.children('.dropdown-toggle').length > 0 ? parent.children('.dropdown-toggle') : parent.children('a:nth-child(1)');

        switch (this.options.effect) {
            case 'fade': $(el).fadeOut('fast'); break;
            case 'slide': $(el).slideUp('fast'); break;
            default: $(el).hide();
        }
        this._trigger("onClose", null, el);
        toggle.removeClass('active-toggle');
    },

    _destroy: function(){
    },

    _setOption: function(key, value){
        this._super(key, value);
        if (key === 'onDrop') {
            this.options.onDrop = this._checkEventFunc(this.options.onDrop);
        } else if (key === 'onUp') {
            this.options.onUp = this._checkEventFunc(this.options.onUp);
        }

    }
});

$(document).on('click', function(e){
    $('[data-role=dropdown]').each(function(i, el){
        if (!$(el).hasClass('keep-open') && $(el).css('display')==='block') {
            var that = $(el).data('dropdown');
            that._close(el);
        }
    });
});
