$('document').ready(function(){
    'use strict';
    $('.wrapper').load('views/main.html', function(){
        $.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
            controllerProvider.setInitialDepth(1);
        });
        myVideoApp.initDialogSetting();

        $('#btnSetting').on('focused', function(){
            myVideoApp.setOverviewDark(false);
        }).on('selected', function(){
            myVideoApp.openDialogSetting();
        });

        $('#btnBack').on('selected', function(){
            myVideoApp.back();
        });

        $('#btnPlay').on('selected', function(){
            setMediaControllerTimer();
            myVideoApp.changeDepth(myVideoApp._DEPTH.PLAYER);
            myVideoApp.launchPlayer();
        });
    });

    var relatedPlaylistItems = [];

    myVideoApp.initVideoPlayer(); // Initialize video plugin.

    var updateRelatedPlaylist = function(listData){
        relatedPlaylistItems = listData;
        $('#related-play-list')[0].caphList.update();
    };

    var mediaControllerTimer;
    var controllerElement = $('#caphPlayer .controls-bar');
    var isShowController = true;
    var showPlayerController = function(val){
        if(val === true){
            isShowController = true;
            controllerElement.css('opacity', 1);
        } else {
            isShowController = false;
            controllerElement.css('opacity', 0);
        }
    };
    var setMediaControllerTimer = function(){
        showPlayerController(true);
        if(mediaControllerTimer){
            clearTimeout(mediaControllerTimer);
        }
        mediaControllerTimer = setTimeout(function(){
            showPlayerController(false);
            mediaControllerTimer = null;
        }, CONSTANT.MEDIA_CONTROLLER_TIMEOUT);
    };
    controllerElement.on('mouseover', function(){
        setMediaControllerTimer();
    });

    $.caph.focus.controllerProvider.addBeforeKeydownHandler(function(context){
        if(myVideoApp.currentDepth === myVideoApp._DEPTH.PLAYER){
            if(!isShowController){
                setMediaControllerTimer();
                return false;
            } else {
                setMediaControllerTimer();
            }
        }
        switch(context.event.keyCode){
            case CONSTANT.KEY_CODE.RETURN:
            case CONSTANT.KEY_CODE.ESC:
                myVideoApp.back();
                break;
        }
    });
});
