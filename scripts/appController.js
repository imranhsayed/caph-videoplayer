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
    initCategoryListData: function(callback){
        var focusController = $.caph.focus.controllerProvider.getInstance();
        setTimeout(function(){
            var welcomeElement = $('.welcome');
            this.updateCategoryListData(CONSTANT.PREPARED_DATA.COLORS, this._CATEGORY.COLORS, true);
            this.updateCategoryListData(CONSTANT.PREPARED_DATA.ALPHABETS, this._CATEGORY.ALPHABETS, true)
            this.updateCategoryListData(CONSTANT.PREPARED_DATA.NUMBERS, this._CATEGORY.NUMBERS, true);
            welcomeElement.addClass('fade-out');
            focusController.focus($('#' + this._CATEGORY.COLORS + '-' + CONSTANT.PREPARED_DATA.COLORS[0].id));
            callback && callback();
        }.bind(this), 0);//3000);
    },
    updateCategoryListData: function(response, category, reload){
        this._dataCategory[category] = response;
    },
    setOverviewDark: function(dark){
        var container = $('#move-container');
        if(dark){
            container.addClass('opacity-dark');
            container.removeClass('opacity-light');
        } else {
            container.addClass('opacity-light');
            container.removeClass('opacity-dark');
        }
    },
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
    setListContainer: function($event, category){
        if(myVideoApp.currentDepth === myVideoApp._DEPTH.INDEX){
            $('#list-category > .list-area').addClass('list-fadeout'); // fade-out for each list
            $('#category_' + category).parent().removeClass('list-fadeout');

            // Move Container
            if(category === myVideoApp.currentCategory){
                return;
            }

            $('#list-category').css({
                transform: 'translate3d(0, ' + (-CONSTANT.SCROLL_HEIGHT_OF_INDEX * category) + 'px, 0)'
            });
            myVideoApp.currentCategory = category;
        }
    },
    updateOverview: function(item){
        $('.overview > .font-header').html(item.name).css('color', item.color);
        $('.desc').html(item.description);
        $('#wrapper').css('borderColor', item.color);
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
