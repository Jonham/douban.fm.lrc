play_song_name = '';

if(typeof(LRCISOK)!="undefined"){
   throw Error("已经加载！");
}

PROXY_URL = 'http://2.newboneyao.sinaapp.com/utils/proxy/';
$.getScript('http://2.newboneyao.sinaapp.com/static/lrc/lrc.js',function(){
	run_lrc(); 
});

jQuery.ajaxSetup({'async':false}); 

lrc = null; 

$('#fm-section2').append('<div id="lrc-dev" style="font-size:22px;" class="fm-sharing"></div>');
$('#lrc-dev').html('歌词将在这里出现');

//定义歌词输出处理程序
function outputHandler(line, extra){
    $('#lrc-dev').html(line);
}
						
function run_lrc(){
    var currentSongInfo = FM.getCurrentSongInfo();
	
    console.log(currentSongInfo.songName);
	
    $.post(PROXY_URL,{'url': 'http://geci.me/api/lyric/' + currentSongInfo.songName + '/' + currentSongInfo.artistName.split('/')[0] }, function(json){
    	if(json.count){
			play_song_name = currentSongInfo.songName;
				
            $.post(PROXY_URL, {url: json.result[0].lrc}, function(lrcStr){
                if(lrc){
					lrc.stop();
						
				}
				lrc = new Lrc(lrcStr, outputHandler);
					
				lrc.play();
            }, 'text');
				
			}
    }, 'json')


}


FM._setCurrentSongInfo = FM.setCurrentSongInfo;
FM.setCurrentSongInfo = function(z, s, r, v, y, t, x, w){
    
    FM._setCurrentSongInfo(z,s,r,v,y,t,x,w);
    run_lrc();
    
    //切换时情况
    $('#lrc-dev').html('');
}


LRCISOK = true;
