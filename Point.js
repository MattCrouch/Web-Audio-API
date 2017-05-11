function Point(point, audioContext, canvasContext) {
    // Capture data about point
    var x = point.clientX | point.pageX;
    var y = point.clientY | point.pageY;
    var identifier = point.identifier;
    var color = `hsl(${Math.round(Math.random() * 255)}, 100%, 50%)`;

    // Create oscillator node
    var oscillator = audioContext.createOscillator();
    oscillator.frequency.setTargetAtTime(_calculateFrequency(), audioContext.currentTime, 0.01);

    // Create gain node
    var gainNode = audioContext.createGain();
    gainNode.gain.setTargetAtTime(_calculateGain(), audioContext.currentTime, 0.01);

    // Set up analyser
    var audioAnalyser = audioContext.createAnalyser();
    var bufferLength = audioAnalyser.fftSize;

    // Connect together
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.connect(audioAnalyser);

    // Start playing
    oscillator.start(audioContext.currentTime);

    function getIdentifier() {
        return identifier;
    }

    // Update the tone based on point data
    function update(point) {
        x = point.clientX | point.pageX;
        y = point.clientY | point.pageY;

        oscillator.frequency.setTargetAtTime(_calculateFrequency(), audioContext.currentTime, 0.01);
        gainNode.gain.setTargetAtTime(_calculateGain(), audioContext.currentTime, 0.01);
    }

    // Stop playing
    function stop() {
        oscillator.stop(audioContext.currentTime);
        oscillator.disconnect();
    }

    // Draw the waveform on the canvas
    function draw() {
        // Get data at current time
        var dataArray = new Uint8Array(bufferLength);
        audioAnalyser.getByteTimeDomainData(dataArray);

        // Style the line
        canvasContext.lineWidth = 3;
        canvasContext.strokeStyle = color;

        // Start the line
        canvasContext.beginPath();

        // Determine the width of each segment
        var sliceWidth = window.innerWidth / bufferLength;
        
        // Draw the line
        var x = 0;
        for (var i = 0; i < bufferLength; i++) {
            var amplitude = dataArray[i] / 128;
            var y = amplitude * window.innerHeight / 2;

            if (i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }

            x += sliceWidth;
        }

        // End the line in the middle of the right edge of the canvas
        canvasContext.lineTo(window.innerWidth, window.innerHeight / 2);

        // Render the line
        canvasContext.stroke();
    };

    // Calculate the frequency based on the window width
    function _calculateFrequency() {
        var minFrequency = 20;
        var maxFrequency = 2000;

        return ((x / window.innerWidth) * maxFrequency) + minFrequency;
    };

    // Calculate the volume based on the window width
    function _calculateGain() {
        var minGain = 0;
        var maxGain = 1;

        return 1 - ((y / window.innerHeight) * maxGain) + minGain;
    };

    // Return values for main script
    return {
        getIdentifier: getIdentifier,
        update: update,
        stop: stop,
        draw: draw
    }
}