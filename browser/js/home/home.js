app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'MediaController'
    });
});

app.controller('MediaController', function ($scope) {
    
    var options = {
        "audio": true,
        "video": true,
        el: "webcam",
        extern: null,
        append: true,
        width: 320,
        height: 240,
        mode: "callback",
        quality: 85,
        debug: function () {},
        onCapture: function () {
            window.webcam.save();
        },
        onSave: function (data) {},
        onLoad: function () {}
    };
    
    function success(stream) {
        stream.getVideoTracks(function(e) {
            console.log('e: ', e);
        });

        if (options.context === 'webrtc') {
            var video = options.videoEl;
            var vendorURL = window.URL || window.webkitURL;
            video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
            console.log('video: ', video);
            console.log('stream: ', stream);
            video.onerror = function () {
                stream.getVideoTracks()[0].stop();
                streamError();
            };

        } else {
        // We can add Flash context if we wantz but hopefully won't be necessary
        // for this demo
        }
    };

    function error(err) {
        console.log('Whoops, err: ', err);
    };

    getUserMedia(options, success, error);
});
