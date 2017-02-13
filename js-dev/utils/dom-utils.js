(function ($) {

    var registers = {};

    registers.tempFullMask = $("<div>").css({
        "position": "fixed",
        "left": 0,
        "top": 0,
        "width": "100%",
        "height": "100%",
        "z-index": 99999999
    });

    $(document).on("mouseup", function () {
        registers.tempFullMask.remove();
    });

    $.domUtils = $.domUtils || {};

    $.domUtils.getScrollbarWidth = function () {
        if (!registers.scrollbarWidth) {
            var ele = $("<div>");
            ele.css({
                "width": "10px",
                "height": "10px",
                "overflow": "scroll"
            });
            $(document.body).append(ele);
            registers.scrollbarWidth = ele[0].offsetWidth - ele[0].scrollWidth;
            ele.remove();
        }
        return registers.scrollbarWidth;
    }
    $.domUtils.getElementPageOffset = function (element) {
        var left = 0;
        var top = 0;
        var doc = document;
        var body = doc.body;
        while (element != null && element != body && element != doc) {
            left += element.offsetLeft;
            top += element.offsetTop;
            element = element.offsetParent;
        }
        return {left: left, top: top};
    }
    $.domUtils.createSvg = function (tagName) {
        return $(document.createElementNS("http://www.w3.org/2000/svg", tagName));
    }
    $.domUtils.createElement = function (tagName) {
        return $("<" + tagName + ">");
    }
    $.domUtils.getAndAppendAutoFullMask = function (cursor) {
        registers.tempFullMask.css({
            "cursor": cursor
        });
        return registers.tempFullMask.appendTo(document.body);
    };

})(jQuery);