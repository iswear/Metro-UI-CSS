$.widget( "metro.treeview" , $.metro.plugin, {

    version: "3.0.0",

    options: {
        onClick: function(leaf, node, pnode, tree){  },
        onDblClick: function () {  },
        onSelected: function () { return true; },
        onInputChanged: function(leaf, node, pnode, tree){  },
        onExpand: function(leaf, node, pnode, tree){ return true; },
        onCollapse: function(leaf, node, pnode, tree){ return true; }
    },

    _selectedNode: null,
    _movingStatus: null,

    _create: function () {
        this._super();
        this.element.data('treeview', this);
    },

    _init: function () {
        this._super();
        var element = this.element;
        this._movingStatus = {
            srcNode: null,
            desNode: null,
            curNodeView: null,
            index: 0
        };
        this._on(this.document, {
            "mouseup": "_mouseupDocument"
        });
        this._initTreeNodes(element.children("ul"));
    },

    _initTreeNodes: function (ul) {
        var $nodes = ul.children(".node");
        for (var i = 0, len = $nodes.length; i < len; ++i) {
            var $node = $($nodes[i]);
            var $nodeView = $node.children(".node-view");
            var $nodeToggle = $nodeView.children(".node-toggle");
            this._on($nodeView, {
                "click": "_clickNodeView",
                "dblclick": "_dblClickNodeView",
                "mousedown": "_mousedownNodeView",
                "mousemove": "_mousemoveNodeView",
                "mouseout": "_mouseoutNodeView"
            });
            if ($node.data("mode") === "checkbox"){
                this._createCheckbox($nodeToggle, $node);
            } else if($node.data("mode") === "radio") {
                this._createRadio($nodeToggle, $node);
            }
            this._initTreeNodes($node.children("ul"));
        }
    },

    _clickNodeView: function (e) {
        var $target = $(e.target);
        if (!$target.hasClass("input-control") && !$target.parent().hasClass("input-control")) {
            var o = this.options;
            var $nodeView = $(e.currentTarget);
            var $node = $nodeView.parent();
            if ($target.hasClass("node-toggle")) {
                if ($node.hasClass("collapsed")) {
                    if (typeof o.onExpand === 'function') {
                        if (!o.onExpand($node)) {
                            return;
                        }
                        $node.removeClass("collapsed");
                    }
                } else {
                    if (typeof o.onCollapse === "function") {
                        if (!o.onCollapse($node)) {
                            return;
                        }
                        $node.addClass("collapsed");
                    }
                }
            } else {
                if (typeof o.onClick === "function") {
                    o.onClick($node);
                }
                if (this._selectedNode != null) {
                    if (!$node.hasClass("selected")) {
                        if (typeof o.onSelected === "function") {
                            if (!o.onSelected($node)) {
                                return;
                            }
                        }
                        this._selectedNode.removeClass("selected");
                        this._selectedNode = $node;
                        this._selectedNode.addClass("selected");
                    }
                } else {
                    if (typeof o.onSelected === "function") {
                        if (!o.onSelected($node)) {
                            return;
                        }
                    }
                    this._selectedNode = $node;
                    this._selectedNode.addClass("selected");
                }
            }
        }
    },

    _dblClickNodeView: function (e) {
        var $target = $(e.target);
        if (!$target.hasClass("node-toggle") &&
            !$target.hasClass("input-control") &&
            !$target.parent().hasClass("input-control")) {
            var o = this.options;
            var $nodeView = $(e.currentTarget);
            var $node = $nodeView.parent();
            if (!$target.hasClass("node-toggle")) {
                if (typeof o.onDblClick === "function") {
                    o.onDblClick($node)
                }
            }
        }
    },

    _mousedownNodeView: function (e) {
        var $target = $(e.target);
        if (!$target.hasClass("node-toggle") &&
            !$target.hasClass("input-control") &&
            !$target.parent().hasClass("input-control")) {
            var $nodeView = $(e.currentTarget);
            var $node = $nodeView.parent();
            this._movingStatus.srcNode = $node;
        }
    },

    _mousemoveNodeView: function (e) {
        if (this._movingStatus.srcNode != null) {
            var curNodeView = $(e.currentTarget), curNode = curNodeView.parent(), $desNode, relPos;
            this._movingStatus.curNodeView = curNodeView;
            if (curNode[0] === this._movingStatus.srcNode[0]) {
                if (this._movingStatus.desNode != null) {
                    this._movingStatus.curNodeView.removeClass("move-up move-center move-down");
                    this._movingStatus.curNodeView = null;
                    this._movingStatus.desNode = null;
                }
                return;
            }
            var nOff = curNodeView.offset();
            var height = curNodeView.outerHeight();
            var eOff = e.pageY - nOff.top;
            if (eOff <= height / 4) {
                relPos = 1;
                $desNode = curNode.parent().parent();
            } else if (eOff < height * 3 / 4) {
                relPos = 2;
                $desNode = curNode;
            } else {
                relPos = 3;
                $desNode = curNode.parent().parent();
            }
            if (this._movingStatus.desNode == null) {
                if (!this._checkDesNodeInSrcNode($desNode, this._movingStatus.srcNode)) {
                    var desChildNodes = $desNode.children("ul").children(".node");
                    var len = desChildNodes.length;
                    if (relPos === 1) {
                        for (var i = 0; i < len; ++i) {
                            if (desChildNodes[i] === curNode[0]) {
                                this._movingStatus.index = i;
                                break;
                            }
                        }
                        curNodeView.removeClass("move-center move-down").addClass("move-up");
                    } else if (relPos === 2) {
                        this._movingStatus.index = len;
                        curNodeView.removeClass("move-up move-down").addClass("move-center");
                    } else {
                        for (var i = 0; i < len; ++i) {
                            if (desChildNodes[i] === curNode[0]) {
                                this._movingStatus.index = i + 1;
                                break;
                            }
                        }
                        curNodeView.removeClass("move-up move-center").addClass("move-down");
                    }
                    this._movingStatus.desNode = $desNode;
                    this._movingStatus.curNodeView = curNodeView;
                }
            } else {
                if (!this._checkDesNodeInSrcNode($desNode, this._movingStatus.srcNode)) {
                    var desChildNodes = $desNode.children("ul").children(".node");
                    var len = desChildNodes.length;
                    if (relPos === 1) {
                        for (var i = 0; i < len; ++i) {
                            if (desChildNodes[i] === curNode[0]) {
                                this._movingStatus.index = i;
                                break;
                            }
                        }
                        curNodeView.removeClass("move-center move-down").addClass("move-up");
                    } else if (relPos === 2) {
                        this._movingStatus.index = len;
                        curNodeView.removeClass("move-up move-down").addClass("move-center");
                    } else {
                        for (var i = 0; i < len; ++i) {
                            if (desChildNodes[i] === curNode[0]) {
                                this._movingStatus.index = i + 1;
                                break;
                            }
                        }
                        curNodeView.removeClass("move-up move-center").addClass("move-down");
                    }
                    this._movingStatus.desNode = $desNode;
                    this._movingStatus.curNodeView = curNodeView;
                } else {
                    this._movingStatus.curNodeView.removeClass("move-up move-center move-down");
                    this._movingStatus.curNodeView = null;
                    this._movingStatus.desNode = null;
                }
            }
        }
    },

    _mouseoutNodeView: function (e) {
        if (this._movingStatus.srcNode != null) {
            var $nodeView = $(e.currentTarget);
            $nodeView.removeClass("move-up move-center move-down");
            this._movingStatus.desNode = null;
            this._movingStatus.curNodeView = null;
        }
    },

    _mouseupDocument: function (e) {
        if (this._movingStatus.srcNode != null) {
            if (this._movingStatus.desNode != null) {
                var desNodeUl = this._movingStatus.desNode.children("ul");
                if (desNodeUl.length > 0) {
                    var desNodeChilds= desNodeUl.children(".node");
                    if (this._movingStatus.index >= desNodeChilds.length) {
                        desNodeUl.append(this._movingStatus.srcNode);
                    } else {
                        this._movingStatus.srcNode.insertBefore(desNodeChilds[this._movingStatus.index]);
                    }
                } else {
                    this._movingStatus.desNode.append($("<ul>").append(this._movingStatus.srcNode));
                }

                this._movingStatus.desNode = null;
                this._movingStatus.curNodeView.removeClass("move-up move-center move-down");
                this._movingStatus.curNodeView = null;
            }
            this._movingStatus.srcNode = null;
        }
    },

    _checkDesNodeInSrcNode: function (desNode, srcNode) {
        var $el = this.element;
        while (true && desNode.length > 0) {
            if (srcNode[0] === desNode[0]) {
                return true;
            } else if (desNode[0] === $el[0]) {
                break;
            } else {
                desNode = desNode.parent().parent();
            }
        }
        return false;
    },

    _changedInput: function (e) {
        var $target = $(e.target), o = this.options;
        var $node = $target.parent().parent().parent();
        if (typeof o.onInputChanged === "function") {
            o.onInputChanged($node);
        }
    },

    _createCheckbox: function(nodeToggle, node){
        var input, checkbox, check;

        input = $("<label/>").addClass("input-control checkbox small-check");
        checkbox = $("<input/>").attr('type', 'checkbox').appendTo(input);
        check = $("<span/>").addClass('check').appendTo(input);
        input.insertAfter(nodeToggle);

        if (node.data('name') !== undefined) {
            checkbox.attr('name', node.data('name'));
        }
        if (node.data('id') !== undefined) {
            checkbox.attr('id', node.data('id'));
        }
        if (node.data('checked') !== undefined) {
            checkbox.prop('checked', node.data('checked'));
        }
        if (node.data('readonly') !== undefined) {
            checkbox.prop('disabled', node.data('readonly'));
        }
        if (node.data('disabled') !== undefined) {
            checkbox.prop('disabled', node.data('disabled'));
            if (node.data('disabled') === true) {
                node.addClass('disabled');
            }
        }
        if (node.data('value') !==  undefined) {
            checkbox.val(node.data('value'));
        }
        this._on(checkbox, {
            "change": "_changedInput"
        });
    },

    _createRadio: function(nodeToggle, node){
        var input, checkbox, check;

        input = $("<label/>").addClass("input-control radio small-check");
        checkbox = $("<input/>").attr('type', 'radio').appendTo(input);
        check = $("<span/>").addClass('check').appendTo(input);
        input.insertAfter(nodeToggle);
        if (node.data('name') !== undefined) {
            checkbox.attr('name', node.data('name'));
        }
        if (node.data('id') !== undefined) {
            checkbox.attr('id', node.data('id'));
        }
        if (node.data('checked') !== undefined) {
            checkbox.prop('checked', node.data('checked'));
        }
        if (node.data('readonly') !== undefined) {
            checkbox.prop('disabled', node.data('readonly'));
        }
        if (node.data('disabled') !== undefined) {
            checkbox.prop('disabled', node.data('disabled'));
            if (node.data('disabled') === true) {
                node.addClass('disabled');
            }
        }
        if (node.data('value') !==  undefined) {
            checkbox.val(node.data('value'));
        }
        this._on(checkbox, {
            "change": "_changedInput"
        });
    },


    _destroy: function () {
    },

    _setOption: function ( key, value ) {
        this._super(key, value);
        if (key === 'onClick') {
            this.options.onClick = this._checkEventFunc(this.options.onClick);
        } else if (key === 'onInputClick') {
            this.options.onInputClick = this._checkEventFunc(this.options.onInputClick);
        } else if (key === 'onExpand') {
            this.options.onExpand = this._checkEventFunc(this.options.onExpand);
        } else if (key === 'onCollapse') {
            this.options.onCollapse = this._checkEventFunc(this.options.onCollapse);
        }
    }
});
