$.widget( "metro.fluentmenu" , $.metro.plugin, {

    version: "3.0.0",

    options: {
        onSpecialClick: function(a, li){},
        onTabClick: function(a, li){},
        onTabChange: function(a, li){}
    },

    _create: function () {
        this._super();
        this.element.data('fluentmenu', this);
    },

    _init: function () {
        this._super();
        this._createMenu();
    },

    _createMenu: function(){
        var that = this, element = this.element, o = this.options;
        var active_tab = $(element.find(".tabs-holder > li.active")[0]);

        this.openTab(active_tab);

        element.on("click", ".tabs-holder > li > a", function(e){
            var a = $(this);
            var li = a.parent('li');

            if (li.hasClass('special')) {
                if (typeof o.onSpecialClick === 'function') {
                    o.onSpecialClick(a, li);
                }
            } else {
                var panel = $(a.attr('href'));
                that._hidePanels();
                that._showPanel(panel);
                element.find('.tabs-holder > li').removeClass('active');
                a.parent('li').addClass('active');

                if (typeof o.onTabClick === 'function') {
                    o.onTabClick(a, li);
                }

                if (typeof o.onTabChange === 'function') {
                    o.onTabChange(a, li);
                }
            }
            e.preventDefault();
        });
    },

    _hidePanels: function(){
        this.element.find('.tab-panel').hide();
    },

    _showPanel: function(panel){
        if (panel == undefined) {
            panel = this.element.find('.tabs-holder li.active a').attr('href');
        }
        $(panel).show();
    },

    openTab: function(tab){
        var element = this.element, o = this.options;
        var target_panel = $(tab.children('a').attr('href'));
        if (target_panel.length === 0) {
            return false;
        }
        this._hidePanels();
        this._showPanel(target_panel);
        element.find('.tabs-holder > li').removeClass('active');
        tab.addClass('active');
    },

    _destroy: function () {
    },

    _setOption: function ( key, value ) {
        this._super(key, value);
        if (key === 'onSpecialClick') {
            this.options.onSpecialClick = this._checkEventFunc(this.options.onSpecialClick);
        } else if (key === 'onTabChange') {
            this.options.onTabChange = this._checkEventFunc(this.options.onTabChange);
        } else if (key === 'onTabClick') {
            this.options.onTabClick = this._checkEventFunc(this.options.onTabClick);
        }
    }
});
