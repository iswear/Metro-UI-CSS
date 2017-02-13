$.widget( "metro.tabcontrol" , $.metro.plugin, {

    version: "3.0.0",

    options: {
        openTarget: false,
        saveState: false,
        onTabClick: function (tab, frame) { return true; },
        onTabCreate: function (tab, frame) { return true; },
        onTabActive: function (tab, frame) { return true; },
        onTabClose: function (tab, frame) { return true; },
        _current: {tab: false},
        _tabMove: {isMoving: false, tempTab: null, target: null, isBefore: false}
    },

    _create: function () {
        this._super();
        this.element.data('tabcontrol', this);

    },

    _init: function () {
        this._super();
        var element = this.element, o = this.options;
        var tabs = element.children('.tabs');
        var tab;

        if (o.saveState && element.attr('id') !== undefined && element.attr('id').trim() !== '') {

            var target = window.localStorage.getItem(element.attr('id')+"-stored-tab");
            if (target && target !== 'undefined') {
                tab = tabs.children("li[data-id='"+target+"']");
                if (tab.length == 0) {
                    tab = false;
                }
            }
        }

        if (!tab && o.openTarget !== false) {
            tab = tabs.find("li[data-id='"+ o.openTarget+"']");
            if (tab.length == 0) {
                tab = false;
            }
        }

        if (!tab) {
            tab = this._chooseAutoOpenTab(false);
            if (!tab || tab.length == 0) {
                tab = false;
            }
        }

        var $tabsMore, $button, $ul;
        $tabsMore = element.children(".tabs-more");
        if ($tabsMore.length == 0) {
            $button = $("<span>");
            $ul = $("<ul>");
            $tabsMore = $("<div>").addClass('tabs-more').append($button).append($ul);
            element.append($tabsMore);
        } else {
            $tabsMore = $($tabsMore[0]);
            $button = $tabsMore.children("span");
            if ($button.length == 0) {
                $button = $("<span>");
                $tabsMore.prepend($button);
            } else {
                $button = $($button[0]);
            }
            $ul = $tabsMore.children("ul");
            if ($ul.length == 0) {
                $ul = $("<ul>");
                $tabsMore.append($ul);
            } else {
                $ul = $($ul[0]);
            }
        }
        $ul.append(tabs.children("li").clone());
        $ul.dropdown({
            noClose: false,
            toggleElement: $button,
            onDrop: function () {
                if (element.children(".tabs").children("li").length > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        });


        var tabItems = tabs.children('li');
        for (var i = 0, len = tabItems.length; i < len; ++i) {
            this._initTab($(tabItems[i]));
        }
        this._openTab(tab);
    },


    _initTab: function (tab) {
        var o = this.options, element = this.element;
        var id = tab.data["id"];
        this._on(tab, {
            "mousedown": "_mousedownTab"
        });
        var moreTab = element.children(".tabs-more").children("ul").children("li[data-id='" + tab.data("id") + "']");
        if (moreTab.length > 0) {
            this._on(moreTab, {
                "mousedown": "_mousedownTab"
            });
        }
        tab.draggable({
            dragArea: this.element.children(".tabs"),
            onDragStart: function (e, el, offset) {
                var $target = $(e.target);
                if (!$target.hasClass("close-btn")) {
                    if (!o._tabMove.isMoving) {
                        o._tabMove.isMoving = true;
                        var tab = el;
                        var tabs = el.parent();
                        var tabsOffset = tabs.offset();
                        var tabOffset = tab.offset();
                        o._tabMove.tempTab = tab.clone();
                        o._tabMove.tempTab.css({
                            "visibility": "hidden"
                        });
                        tab.after(o._tabMove.tempTab);
                        tab.css({
                            "position": "absolute",
                            "left": tabOffset.left - tabsOffset.left,
                            "top": tabOffset.top - tabsOffset.top
                        });
                    }
                    return true;
                } else {
                    return false;
                }
            },
            onDragMove: function (e, el, offset) {
                if (o._tabMove.isMoving) {
                    offset.top = undefined;
                    var tab = el;
                    var tabs = tab.parent();
                    var tabsArr = tabs.children("li");
                    var tabsArr2 = [];
                    for (var i = 0, len = tabsArr.length; i < len; ++i) {
                        if (tabsArr[i] !== tab[0] && tabsArr[i] !== o._tabMove.tempTab[0]) {
                            tabsArr2.push(tabsArr[i]);
                        }
                    }
                    for (var i = 0, len = tabsArr2.length; i < len; ++i) {
                        var $cur = $(tabsArr2[i]);
                        var curLeft = $cur.offset().left;
                        var curRight = curLeft + $cur.outerWidth();
                        var tabLeft = tab.offset().left;
                        var tabRight = tabLeft + tab.outerWidth();

                        if (tabLeft > curLeft && tabLeft < curLeft + (curRight - curLeft) / 3) {
                            o._tabMove.target = $cur;
                            o._tabMove.isBefore = true;
                            $cur.before(o._tabMove.tempTab);
                            break;
                        } else if (tabRight < curRight && tabRight > curRight - (curRight - curLeft) / 3) {
                            o._tabMove.target = $cur;
                            o._tabMove.isBefore = false;
                            $cur.after(o._tabMove.tempTab);
                            break;
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            },
            onDragStop: function (e, el, offset) {
                if (o._tabMove.isMoving) {
                    o._tabMove.isMoving = false;
                    if (o._tabMove.tempTab != null) {
                        o._tabMove.tempTab.remove();
                        o._tabMove.tempTab = null;

                        el.removeAttr("style");
                        if (o._tabMove.target != null) {
                            if (o._tabMove.isBefore) {
                                o._tabMove.target.before(el);
                            } else {
                                o._tabMove.target.after(el);
                            }
                            o._tabMove.target = null;
                            o._tabMove.isBefore = false;
                        }
                    }
                }
                return true;
            }
        });
    },

    _mousedownTab: function (e) {
        var $target = $(e.target);
        var o = this.options, element = this.element;
        if ($target.hasClass("close-btn")) {
            var id = $(e.currentTarget).data("id");
            var tab = element.children(".tabs").children("li[data-id='" + id + "']");
            var moreTab = element.children(".tabs-more").children("ul").children("li[data-id='" + id + "']");
            var frame = element.children(".frames").children("div[data-id='" + id + "']");

            if (typeof o.onTabClose === 'function') {
                if (!o.onTabClose(tab, frame)) {
                    return;
                }
            }
            tab.removeClass("active");
            this._off(tab, "mousedown");
            this._off(moreTab, "mousedown");
            var openTab = this._chooseAutoOpenTab(tab);
            if (openTab) {
                this._openTab(openTab);
            } else {
                this._openTab(false);
            }
            tab.remove();
            moreTab.remove();
            frame.remove();
        } else {
            var o = this.options;
            var id = $(e.currentTarget).data("id");

            var tab = element.children(".tabs").children("li[data-id='" + id + "']");
            var frame = element.children(".frames").children("div[data-id='" + id + "']");

            if (typeof o.onTabClick === 'function') {
                if (!o.onTabClick(tab, frame)) {
                    return;
                }
            }
            this._openTab(tab);
            e.preventDefault();
            e.stopPropagation();
        }
    },
    
    _chooseAutoOpenTab: function (srcTab) {
        var tabs = this.element.children(".tabs");

        var tab;
        tab = tabs.children(".active");
        if (tab.length > 0) {
            return $(tab[0]);
        }
        if (srcTab) {
            tab = srcTab.next();
            if (tab.length > 0) {
                return tab;
            }
            tab = srcTab.prev();
            if (tab.length > 0) {
                return tab;
            }
        } else {
            var tab = tabs.children('li');
            if (tab.length > 0) {
                return $(tab[0]);
            }
        }
        return null;
    },

    _openTab: function(tab){
        var element = this.element, o = this.options;
        if (tab) {
            o._current.tab = tab;
            var id = tab.data("id");
            var frame = element.children(".frames").children("div[data-id='" + id + "']");
            if (typeof o.onTabActive === 'function') {
                if (!o.onTabActive(tab, frame)) {
                    return;
                }
            }

            var frames = element.children('.frames').children('div');
            var tabs = element.children('.tabs').children('li');
            var moreTabs = element.children(".tabs-more").children("ul").children("li");
            var moreTab = element.children(".tabs-more").children("ul").children("li[data-id='" + id + "']");

            tabs.removeClass('active');
            moreTabs.removeClass('active');
            frames.hide();

            tab.addClass('active');
            moreTab.addClass('active');
            frame.show();

            var tabsCon = element.children(".tabs");
            var conScrollLeft = tabsCon.scrollLeft();
            var conWidth = tabsCon.outerWidth() - element.children(".tabs-more").children("span").outerWidth();
            var tabWidth = tab.outerWidth();
            var tabOffsetLeft = tab.offset().left - tabsCon.offset().left;
            if (tabOffsetLeft < 0) {
                tabsCon.scrollLeft(conScrollLeft + tabOffsetLeft);
            } else if(tabOffsetLeft + tabWidth > conWidth - 30) {
                tabsCon.scrollLeft(conScrollLeft + (tabOffsetLeft + tabWidth - conWidth + 30));
            }

            if (o.saveState && element.attr('id') !== undefined && element.attr('id').trim() !== '') {
                window.localStorage.setItem(element.attr('id')+"-stored-tab", o._current.tab.data('id'));
            }
        } else {
            o._current.tab = false;
        }

    },

    createEmptyTab: function (id, title, closeAble) {
        var element = this.element;
        var tabs = element.children(".tabs");
        var moreTabs = element.children(".tabs-more").children("ul");
        var frames = element.children(".frames");
        if (tabs.children("li[data-id='" + id + "']").length > 0) {
            return;
        }

        var tab;
        if (closeAble === true) {
            tab = $("<li data-id='" + id + "'><a>" + title + "</a><span class='close-btn'></span></li>")
        } else {
            tab = $("<li data-id='" + id + "'><a>" + title + "</a></li>");
        }
        var frame = $("<div data-id='" + id + "' class='frame'></div>");

        var o = this.options;
        if (typeof o.onTabCreate === 'function') {
            if (!o.onTabCreate(tab, frame)) {
                return;
            }
        }
        tabs.append(tab);
        moreTabs.append(tab.clone());
        frames.append(frame);
        this._initTab(tab);
        this._openTab(tab);
    },

    _destroy: function () {
    },

    _setOption: function ( key, value ) {
        this._super(key, value);
        if (key === 'onTabClick') {
            this.options.onTabClick = this._checkEventFunc(this.options.onTabClick);
        } else if (key === 'onTabClose') {
            this.options.onTabClose = this._checkEventFunc(this.options.onTabClose);
        } else if (key === 'onTabActive') {
            this.options.onTabActive = this._checkEventFunc(this.options.onTabActive);
        } else if (key === 'onTabCreate') {
            this.options.onTabCreate = this._checkEventFunc(this.options.onTabCreate);
        }
    }
});
