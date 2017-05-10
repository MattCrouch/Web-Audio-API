(function() {
    // Set up the context for the Web Audio API
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Add placeholders for generated oscillator and gain node
    var points = [];

    // Save a reference to the canvas and get its context
    var canvas = document.getElementById("theremin");
    var canvasContext = canvas.getContext("2d");
    
    // Keep canvas dimensions matching the window
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function mouseStart(e) {
        e.preventDefault();

        var point = new Point(e, audioContext);
        points.push(point);
    }
    
    function touchStart(e) {
        e.preventDefault();

        for (var i = 0; i < e.changedTouches.length; i++) {
            var point = new Point(e.changedTouches[i], audioContext);

            points.push(point);
        }
    }

    function mouseMove(e) {
        e.preventDefault();

        var pos = getPos(undefined);
        
        if(pos !== null) {
            points[pos].update(e);
        }
    }

    function touchMove(e) {
        e.preventDefault();

        for (var i = 0; i < e.changedTouches.length; i++) {
            var pos = getPos(e.changedTouches[i].identifier);
            
            if(pos !== null) {
                points[pos].update(e);
            }
        }
    }

    function mouseEnd(e) {
        e.preventDefault();

        var pos = getPos(undefined);
        
        if(pos !== null) {
            points[pos].stop();
            points.splice(pos, 1);
        }
    }

    function touchEnd(e) {
        e.preventDefault();

        for (var i = 0; i < e.changedTouches.length; i++) {
            var pos = getPos(e.changedTouches[i].identifier);
            
            if(pos !== null) {
                points[pos].stop();
                points.splice(pos, 1);
            }
        }
    }

    function getPos(id) {
        for (var i = 0; i < points.length; i++) {
            if (points[i].getIdentifier() == id) {
                return i;
            }
        }

        return null;
    }

    canvas.addEventListener('mousedown', mouseStart);
    canvas.addEventListener('touchstart', touchStart);
    canvas.addEventListener('mouseup', mouseEnd);
    canvas.addEventListener('mouseout', mouseEnd);
    canvas.addEventListener('touchend', touchEnd);
    canvas.addEventListener('touchcancel', touchEnd);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('touchmove', touchMove);
})();