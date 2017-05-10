function Point(point, audioContext, canvasContext) {
    var x = point.clientX | point.pageX;
    var y = point.clientY | point.pageY;
    var identifier = point.identifier;

    var oscillator = audioContext.createOscillator();
    oscillator.frequency.setTargetAtTime(_calculateFrequency(x), audioContext.currentTime, 0.01);
            
    var gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setTargetAtTime(_calculateGain(y), audioContext.currentTime, 0.01);

    oscillator.start(audioContext.currentTime);

    





    var audioAnalyser = audioContext.createAnalyser();

    audioAnalyser.fftSize = 2048;
    var bufferLength = audioAnalyser.fftSize;
    var dataArray = new Uint8Array(bufferLength);
    audioAnalyser.getByteTimeDomainData(dataArray);

    gainNode.connect(audioAnalyser);
    audioAnalyser.connect(audioContext.destination);

    function draw() {
      audioAnalyser.getByteTimeDomainData(dataArray);

      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = 'rgb(0, 0, 0)';

      canvasContext.beginPath();

      var sliceWidth = window.innerWidth * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
   
        var v = dataArray[i] / 128.0;
        var y = v * window.innerHeight/2;

        if(i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasContext.lineTo(window.innerWidth, window.innerHeight/2);
      canvasContext.stroke();
    };











    function getIdentifier() {
        return identifier;
    }

    function update(point) {
        x = point.clientX | point.pageX;
        y = point.clientY | point.pageY;

        oscillator.frequency.setTargetAtTime(_calculateFrequency(x), audioContext.currentTime, 0.01);
        gainNode.gain.setTargetAtTime(_calculateGain(y), audioContext.currentTime, 0.01);
    }

    function stop() {
        oscillator.stop(audioContext.currentTime);
        oscillator.disconnect();
    }

    function _calculateFrequency(xPosition) {
        var minFrequency = 20,
            maxFrequency = 2000;

        return ((xPosition / window.innerWidth) * maxFrequency) + minFrequency;
    };

    function _calculateGain(yPosition) {
        var minGain = 0,
            maxGain = 1;

        return 1 - ((yPosition / window.innerHeight) * maxGain) + minGain;
    };

    return {
        getIdentifier: getIdentifier,
        update: update,
        stop: stop,
        draw: draw
    }
}