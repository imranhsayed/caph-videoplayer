'use strict';
var myVideoApp = {
    _CATEGORY : CONSTANT.CATEGORY,
    _DEPTH : {
        INDEX: 1,
        DETAIL: 2,
        PLAYER: 3,
        SETTING: 4
    },
    _dataCategory: [],
    relatedPlaylistItems: [],
    currentCategory: undefined,
    currentDepth: undefined,
    lastDepth: undefined,
    dialogSetting: undefined,
    playSetting: {
        chkAutoPlay: true,
        chkSubTitle: false
    },
    videoControls: undefined,
    changeDepth: function(depth){
        for(var dth in this._DEPTH){
            if(this._DEPTH[dth] !== depth){
                $('.depth' + this._DEPTH[dth]).hide();
            }
        }
        $('.depth' + depth).show();
        this.lastDepth = this.currentDepth;
        this.currentDepth = depth;
        $.caph.focus.controllerProvider.getInstance().setDepth(depth);
    },
    updateRelatedPlaylist: function(listData){
        this.relatedPlaylistItems = listData;
        $('#related-play-list')[0].caphList.update();
    },
    initDialogSetting: function(){ // Initialize the setting dialog box.
        var _this = this;
        if(!this.dialogSetting){
            this.dialogSetting = $('#dialogSetting').caphDialog({
                position: {x:551, y:287},
                focusOption: {
                    depth: myVideoApp._DEPTH.SETTING
                },
                onSelectButton: function(buttonIndex, event){
                    _this.dialogSetting.caphDialog('close');
                }
            });
            $('#chkAutoPlay').caphCheckbox({
                focusOption: {
                    depth: myVideoApp._DEPTH.SETTING
                },
                checked: _this.playSetting.chkAutoPlay,
                onSelected :function(){
                    _this.playSetting.chkAutoPlay = !_this.playSetting.chkAutoPlay;
                }
            });
            $('#chkSubTitle').caphCheckbox({
                focusOption: {
                    depth: myVideoApp._DEPTH.SETTING
                },
                checked: _this.playSetting.chkSubTitle,
                onSelected :function(){
                    _this.playSetting.chkSubTitle = !_this.playSetting.chkSubTitle;
                }
            });
        }
    },
    openDialogSetting: function(){
        if(!this.dialogSetting){
            this.initDialogSetting();
        }
        this.dialogSetting.caphDialog('open');
    },
    initVideoPlayer: function(){ // Initialize video plugin using caphMedia.
	    var _this = this;
	    this.player = $('#caphPlayer').caphMedia({
		    controller: { // Button's ID for controlling.
			    restart: 'btnPlayerRestart',
			    rewind: 'btnPlayerRewind',
			    togglePlay: 'btnPlayerPlay',
			    forward: 'btnPlayerForward',
			    next: 'btnPlayerNext'
		    },
		    onEnded: function(){ // The event handler when the video ends playing.
			    if(_this.currentDepth === _this._DEPTH.PLAYER){
				    _this.back();
			    }
		    },
		    onError: function(){ // The event handler when the error occurs during playing.
			    if(_this.currentDepth === _this._DEPTH.PLAYER){
				    _this.back();
			    }
		    }
        });
        // this.videoControls = {
        //     play: function(){
        //         $('#btnPlayerPlay').trigger('selected');
        //     },
        //     pause: function(){
        //         $('#btnPlayerPlay').trigger('selected');
        //     },
        //     restart: function(){
        //         $('#btnPlayerRestart').trigger('selected');
        //     },
        //     rewind: function(){
        //         $('#btnPlayerRewind').trigger('selected');
        //     },
        //     forward: function(){
        //         $('#btnPlayerForward').trigger('selected');
        //     },
        //     next: function(){
        //         $('#btnPlayerNext').trigger('selected');
        //     }
        // };
        // $('#btnPlayerReturn').on('selected', function(){
        //     this.back()
        // }.bind(this));
    },
    launchPlayer: function(){

	    this.initVideoPlayer();
	    console.warn( 'this.player', this.player );
        if(this.playSetting.chkAutoPlay){
            this.player[0].caphMedia.play();
        }

        // $.caph.focus.controllerProvider.getInstance().focus('btnPlayerPlay');
    },
    back: function(){
        if(this.currentDepth === this._DEPTH.INDEX){
            return;
        }
        var targetDepth;
        switch(this.currentDepth){
            case this._DEPTH.DETAIL:
                targetDepth = this._DEPTH.INDEX;
                break;
            case this._DEPTH.PLAYER:
                if(this.videoControls && this.videoControls.pause){
                    this.videoControls.pause();
                }
                targetDepth = this.lastDepth;
                break;
            default:
                targetDepth = this._DEPTH.INDEX;
        }
        this.changeDepth(targetDepth);
    }
};
