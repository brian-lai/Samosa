app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'MediaController'
    });
});

app.controller('MediaController', function ($scope) {
    $scope.logger;

    var canvas = document.getElementById('preview');
    var context = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;

    context.width = canvas.width;
    context.height = canvas.height;

    var video = document.getElementById('video');
    
    var socket = io();

    function logger(msg) {
        $scope.logger = msg;
    }

    function loadCam(stream) {
        video.src = window.URL.createObjectURL(stream)
            video.play();
        logger('Cam load successful!');
    }

    function loadFail() {
        logger('Cam load failed!');
    }

    function viewVideo(video, context) {
        context.drawImage(video, 0, 0, context.width, context.height);
        socket.emit('stream', canvas.toDataURL('image/webp'));
    }
    
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

    function init() {
        navigator.getUserMedia = (
            navigator.getUserMedia || navigator.webkitGetUserMedia || 
            navigator.mozGetUserMedia || navigator.msgGetUserMedia
        );

        if (navigator.getUserMedia) {
            navigator.getUserMedia(options, loadCam, loadFail);
        }

        setInterval(function() {
            viewVideo(video, context)
        }, 70);

        socket.on('serverStream', function(image) {
            var img = document.getElementById('play');
            img.src = image;
            logger(image);
        });
    }
    init();



    /*var options = {
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
    */ 
});
