$.widget("metro.timeaxis", $.metro.plugin, {

    version: '1.0.0',

    options: {
        space: 8,
        duration: 0,
        keyFrames: null
    },

    _$timeRule: null,
    _$timeLine: null,

    _create: function () {
        this._super();
        var element = this.element;
        this._$timeRule = element.children(".time-rule");
        this._$timeLine = element.children(".time-line");
        if (this._$timeRule.length > 0) {
            this._$timeRule = $(this._$timeRule.get(0));
        } else {
            this._$timeRule = $("<div>").addClass("time-rule").appendTo(element);
        }
        if (this._$timeLine.length > 0) {
            this._$timeLine = $(this._$timeLine.get(0));
        } else {
            this._$timeLine = $("<div>").addClass("time-line").appendTo(element);
        }
        this.element.data("timeaxis", this);
    },

    _layoutRuleAndLine: function () {
        var o = this.options;
        var num = o.duration * 10;
        var $rulePoints = this._$timeRule.children(".time-point");
        var rulePointsNum = $rulePoints.length;
        var space = (o.space + 1) * 10;
        if (rulePointsNum < num) {
            for (var i = rulePointsNum; i < num; ++i) {
                if (i % 10 == 0) {
                    var time = i / 10;
                    $("<span>").addClass("time-point time-point-long").css({
                        "margin-right": o.space
                    }).appendTo(this._$timeRule);
                    $("<span>").addClass("time-tip")
                        .css({"left": space * time + 2 })
                        .text(time)
                        .appendTo(this._$timeRule);
                } else  if (i % 5 == 0) {
                    $("<span>").addClass("time-point time-point-middle").css({
                        "margin-right": o.space
                    }).appendTo(this._$timeRule);
                } else {
                    $("<span>").addClass("time-point time-point-short").css({
                        "margin-right": o.space
                    }).appendTo(this._$timeRule);
                }
            }
        } else {
            for (var i = num; i < rulePointsNum; ++i) {
                $($rulePoints.get(i)).remove();
            }
            var tips = this._$timeRule.children(".time-tip");
            var tipsNum = tips.length;
            for (var i = Math.ceil(num / 10); i < tipsNum; ++i) {
                $(tips.get(i)).remove();
            }
        }

        var $linePoints = this._$timeLine.children(".time-point");
        var linePointsNum = $linePoints.length;
        if (linePointsNum < num) {
            for (var i = linePointsNum; i < num; ++i) {
                $("<span>").addClass("time-point").css({
                    "margin-right": o.space
                }).appendTo(this._$timeLine);
            }
        } else {
            for (var i = num; i < linePointsNum; ++i) {
                $($linePoints.get(i)).remove();
            }
        }
    },

    _sortAndRemoveDupKeyFrames: function () {
        var kfs = this.options.keyFrames;
        if (typeof kfs === 'array' || typeof kfs === 'object') {
            for (var i = 1, len = kfs.length; i < len; ++i) {
                for (var j = i; j >= 1; --j) {
                    if (kfs[j].time >= kfs[j-1].time) {
                        break;
                    } else {
                        var temp = kfs[j];
                        kfs[j] = kfs[j - 1];
                        kfs[j - 1] = temp;
                    }
                }
            }
            for (var i = 1, len = kfs.length; i < len;) {
                if (kfs[i - 1].time == kfs[i].time) {
                    kfs.splice(i - 1, 0);
                    --i;
                    --len;
                } else {
                    ++i;
                }
            }
        }
    },

    _layoutKeyFrames: function () {
        var space = this.options.space;
        var duration = this.options.duration;
        var kfs = this.options.keyFrames;
        if (typeof kfs === 'array' || typeof kfs === 'object') {
            var $kfs = this._$timeLine.children(".key-frame");
            var $tweens = this._$timeLine.children(".tween");

            var kfsCount = 0;
            var tweensCount = 0;

            var kfsLen = $kfs.length;
            var tweensLen = $tweens.length;

            for (var i = 0, len = kfs.length; i < len; ++i) {
                var curTime = kfs[i].time;
                var curIndex = curTime * 10;

                var curTween = kfs[i].tween;
                if (curTime <= duration) {
                    /**
                     * 绘制关键帧
                     */
                    if (kfsCount < kfsLen) {
                        $($kfs.get(i)).css({
                            "width": space,
                            "left": curIndex * (space + 1) + 1
                        });
                    } else {
                        $("<span>").addClass("key-frame").css({
                            "width": space,
                            "left": curIndex * (space + 1) + 1
                        }).appendTo(this._$timeLine);
                    }
                    ++kfsCount;
                    /**
                     * 绘制补间动画
                     */
                    if (i > 0 && curTween == 1) {
                        var preTime = kfs[i-1].time;
                        var preIndex = preTime * 10;
                        if (tweensCount < kfsLen) {
                            $($tweens.get(i)).css({
                                "left": (preIndex + 0.5) * (space + 1),
                                "width": (curIndex - preIndex) * (space + 1)
                            });
                        } else {
                            $("<span><span class='from'></span><span class='to'></span></span>").addClass("tween").css({
                                "left": (preIndex + 0.5) * (space + 1),
                                "width": (curIndex - preIndex) * (space + 1)
                            }).appendTo(this._$timeLine);
                        }
                        ++tweensCount;
                    }
                }
            }

            for (var i = kfsCount; i < kfsLen; ++i) {
                $($kfs.get(i)).remove();
            }

            for (var i = tweensCount; i < tweensLen; ++i) {
                $($tweens.get(i)).remove();
            }

        } else {
            var $kfs = this._$timeLine.children(".key-frame");
            for (var i = 0, len = $kfs.length; i < len; ++i) {
                $($kfs.get(i)).remove();
            }
            var $tweens = this._$timeLine.children(".tween");
            for (var i = 0, len = $tweens.length; i < len; ++i) {
                $($tweens.get(i)).remove();
            }
        }
    },

    addKeyFrame: function () {
        this._layoutKeyFrames();
    },
    
    addTween: function () {
        this._layoutKeyFrames();
    },

    _destory: function () {
        this._super();
    },

    _setOption: function (key, value) {
        this._super(key, value);
        if (key === 'duration') {
            var o = this.options;
            var width = (o.space + 1) * value * 10;
            this._$timeRule.css({
                "width": width
            });
            this._$timeLine.css({
                "width": width
            });
            this._layoutRuleAndLine();
            if (value < this.options.duration) {
                this._layoutKeyFrames();
            }
        } else if (key === 'keyFrames') {
            this._sortAndRemoveDupKeyFrames();
            this._layoutKeyFrames();
        }
    }

});