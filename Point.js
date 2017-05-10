function Point(point, context) {
    var x = point.clientX | point.pageX;
    var y = point.clientY | point.pageY;
    var identifier = point.identifier;

    var oscillator = context.createOscillator();
    oscillator.frequency.setTargetAtTime(_calculateFrequency(x), context.currentTime, 0.01);
            
    var gainNode = context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.setTargetAtTime(_calculateGain(y), context.currentTime, 0.01);

    oscillator.start(context.currentTime);

    function getIdentifier() {
        return identifier;
    }

    function update(point) {
        x = point.clientX | point.pageX;
        y = point.clientY | point.pageY;

        oscillator.frequency.setTargetAtTime(_calculateFrequency(x), context.currentTime, 0.01);
        gainNode.gain.setTargetAtTime(_calculateGain(y), context.currentTime, 0.01);
    }

    function stop() {
        oscillator.stop(context.currentTime);
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
        stop: stop
    }
}