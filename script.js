(function() {
    // Set up the context for the Web Audio API
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Add placeholders for generated oscillator and gain node
    var oscillator = null;
    var gainNode = null;
    
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

    function calculateFrequency(xPosition) {
        var minFrequency = 20,
            maxFrequency = 2000;

        return ((xPosition / canvas.width) * maxFrequency) + minFrequency;
    };

    function calculateGain(yPosition) {
        var minGain = 0,
            maxGain = 1;

        return 1 - ((yPosition / canvas.height) * maxGain) + minGain;
    };

    function start(e) {
        e.preventDefault();
        var x = e.clientX | e.pageX;
        var y = e.clientY | e.pageY;

        // Mouse has been pressed
        oscillator = audioContext.createOscillator();
        oscillator.frequency.setTargetAtTime(calculateFrequency(x), audioContext.currentTime, 0.01);
        
        
        gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.setTargetAtTime(calculateGain(y), audioContext.currentTime, 0.01);

        oscillator.start(audioContext.currentTime);
    }

    function end(e) {
        e.preventDefault();

        // Mouse has been released
        oscillator.stop(audioContext.currentTime);
        oscillator.disconnect();
    }

    function move(e) {
        e.preventDefault();
        var x = e.clientX | e.pageX;
        var y = e.clientY | e.pageY;

        if(oscillator) {
            oscillator.frequency.setTargetAtTime(calculateFrequency(x), audioContext.currentTime, 0.01);
            gainNode.gain.setTargetAtTime(calculateGain(y), audioContext.currentTime, 0.01);
        }
    }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('touchend', end);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('touchmove', move);
})();