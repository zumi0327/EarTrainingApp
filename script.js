const audioContext = new AudioContext();
let droneOscillator = null;
let noteOscillator = null;

document.getElementById('startButton').addEventListener('click', () => {
    if (droneOscillator) {
        droneOscillator.stop();
        droneOscillator.disconnect();
    }
    droneOscillator = audioContext.createOscillator();
    droneOscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4の音
    droneOscillator.connect(audioContext.destination);
    droneOscillator.start();
});

document.getElementById('stopButton').addEventListener('click', () => {
    if (droneOscillator) {
        droneOscillator.stop();
        droneOscillator.disconnect();
        droneOscillator = null; // オシレーターの参照をクリア
    }
});

document.getElementById('playNoteButton').addEventListener('click', () => {
    if (noteOscillator) {
        noteOscillator.stop();
        noteOscillator.disconnect();
    }
    const randomInterval = Math.floor(Math.random() * 12); // 0から11までのランダムな値
    const frequency = 440 * Math.pow(2, randomInterval / 12); // 音程を計算
    noteOscillator = audioContext.createOscillator();
    noteOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    noteOscillator.connect(audioContext.destination);
    noteOscillator.start();
    noteOscillator.stop(audioContext.currentTime + 10*1000); // 10秒後に停止

	
    displayInterval(randomInterval);
});

function displayInterval(interval) {
    const intervals = ["P1", "m2", "M2", "m3", "M3", "P4", "Tritone", "P5", "m6", "M6", "m7", "M7"];
    document.getElementById('noteInfo').innerText = `再生したノート: ${intervals[interval]}`;
}
