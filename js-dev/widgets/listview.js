$.widget( "metro.listview" , $.metro.plugin, {

    version: "3.0.0",

    options: {
        onExpand: function(group){},
        onCollapse: function(group){},
        onActivate: function(list){},
        onListClick: function(list){}
    },

    _create: function () {
        this._super();
        this.element.data('listview', this);
    },

    _init: function () {
        this._super();
        this._initList();
        this._createEvents();
    },

    _initList: function(){
        var element = this.element;
        var groups = element.find('.list-group');

        $.each(groups, function(){
            var group = $(this);
            if (group.hasClass('collapsed')) {
                group.find('.list-group-content').hide();
            }
        });

    },

    _createEvents: function(){
        var element = this.element, o = this.options;

        element.on('click', '.list-group-toggle', function(e){
            var toggle = $(this), parent = toggle.parent();

            if (toggle.parent().hasClass('keep-open')) {
                return;
            }

            parent.toggleClass('collapsed');

            if (!parent.hasClass('collapsed')) {
                toggle.siblings('.list-group-content').slideDown('fast');
                if (typeof o.onExpand === 'function') {
                    o.onExpand(parent);
                } 
            } else {
                toggle.siblings('.list-group-content').slideUp('fast');
                if (typeof o.onCollapse === 'function') {
                    o.onCollapse(parent);
                }
            }
            e.preventDefault();
            e.stopPropagation();
        });

        element.on('click', '.list', function(e){
            var list = $(this);

            element.find('.list').removeClass('active');
            list.addClass('active');
            if (typeof o.onActivate === 'function') {
                o.onActivate(list);
            } 
            if (typeof o.onListClick === 'function') {
                o.onListClick(list);
            }
            e.preventDefault();
            e.stopPropagation();
        });
    },

    _destroy: function () {
    },

    _setOption: function ( key, value ) {
        this._super(key, value);
        if (key === 'onActivate') {
            this.options.onActivate = this._checkEventFunc(this.options.onActivate);
        } else if (key === 'onCollapse') {
            this.options.onCollapse = this._checkEventFunc(this.options.onCollapse);
        } else if (key === 'onExpand') {
            this.options.onExpand = this._checkEventFunc(this.options.onExpand);
        } else if (key === 'onListClick') {
            this.options.onListClick = this._checkEventFunc(this.options.onListClick);
        }
    }
});
