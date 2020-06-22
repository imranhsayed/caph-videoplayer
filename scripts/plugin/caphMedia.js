(function(window, document, $) {
    var defaultOptions = {

    };

    var CONSTANT = {
        FORWARD_INTERVAL : 15
    };

    function initCap(str){
        return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase();
    }

    function invokeMethod(media, index, method, param) {
        if ($.isNumeric(index)) {
            media[index][method].apply(media[index], param);
        } else {
            media.each(function() {
                this[method].apply(this, param);
            });
        }
    }

    function setProperty(media, index, property, value) {
        if ($.isNumeric(index)) {
            media[index][property] = value;
        } else {
            media.each(function() {
                this[property] = value;
            });
        }
    }

    function forEachProperty(media, index, property, callback) {
        if ($.isNumeric(index)) {
            callback(media[index][property]);
        } else {
            media.each(function() {
                callback(this[property]);
            });
        }
    }

    function forEachTextTracks(media, callback, index) {
        forEachProperty(media, index, 'textTracks', function(textTracks) {
            for (var i = 0, length = textTracks.length; i < length; i++) {
                callback(textTracks[i]);
            }
        });
    }

    function CaphMedia(element, options) {
        var media = $(element).find('video, audio');

        this.isPlaying = false;
        media.on('abort error stalled suspend loadstart durationchange loadedmetadata loadeddata progress canplay canplaythrough ended pause play playing ratechange seeked seeking timeupdate volumechange waiting', function(event) {
            switch(event.type){
                case 'play':
                case 'playing':
                    this.isPlaying = true;
                    break;
                case 'pause':
                case 'ended':
                    this.isPlaying = false;
                    break;
            }
            (options['on' + event.type] || options['on' + initCap(event.type)] || $.noop)(event);
        }.bind(this));

        forEachTextTracks(media, function(textTrack) {
            textTrack.oncuechange = function(event) {
                (options['on' + event.type] || options['on' + initCap(event.type)] || $.noop)(event);
            };
        });

        ['load', 'play', 'pause'].forEach(function(method) {
            this[method] = function(index) {
                invokeMethod(media, index, method);
            }
        }, this);

        this.togglePlay = function(index){
            var methodType = this.isPlaying ? 'pause' : 'play';
            invokeMethod(media, index, methodType);
        };
        this.restart = function(index){
            setProperty(media, index, 'currentTime', 0);
        };
        this.rewind = function(index){
            if ($.isNumeric(index)) {
                setProperty(media, index, 'currentTime', media[index].currentTime - CONSTANT.FORWARD_INTERVAL);
            } else {
                media.each(function(i) {
                    setProperty(media, i, 'currentTime', media[i].currentTime - CONSTANT.FORWARD_INTERVAL);
                });
            }
        };
        this.forward = function(index){
            if ($.isNumeric(index)) {
                setProperty(media, index, 'currentTime', media[index].currentTime + CONSTANT.FORWARD_INTERVAL);
            } else {
                media.each(function(i) {
                    setProperty(media, i, 'currentTime', media[i].currentTime + CONSTANT.FORWARD_INTERVAL);
                });
            }
        };
        this.next = function(index){
            if ($.isNumeric(index)) {
                setProperty(media, index, 'currentTime', media[index].duration);
            } else {
                media.each(function(i) {
                    setProperty(media, i, 'currentTime', media[i].duration);
                });
            }
        };

        this.subTitle = function(show, language, index) {
            forEachTextTracks(media, function(textTrack) {
                if (show && (!language || language === textTrack.language)) {
                    textTrack.mode = 'showing';
                } else {
                    textTrack.mode = 'hidden';
                }
            }, index);
        };

        if(options.controller){
            for(var command in options.controller){
                $(element).find('#'+options.controller[command]).on('selected', function(command){
                    return function() {
                        if (typeof this[command] === 'function') {
                            this[command]();
                        }
                    }.bind(this);
                }.bind(this)(command));
            }
        }
        if(options.subTitle){
            this.subTitle(true, options.subTitle);
        }
    }

    $.fn.caphMedia = function(options) {
        options = $.extend({}, defaultOptions, options || {});

        return this.each(function() {
            this.caphMedia = new CaphMedia(this, options);
        });
    };
})(this, document, jQuery);