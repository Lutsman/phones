import 'jquery-background-video';

$(document).ready(function(){
    const $bgVideo = $('.jquery-background-video');
    const options = {
        pauseAfter: 0,
        showPausePlay: false,
    };
    $bgVideo.bgVideo(options);
});