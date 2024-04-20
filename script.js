const audioContext = new AudioContext();
let droneOscillator = null;
let noteOscillator = null;

document.getElementById('startButton').addEventListener('click', () => {
    // 既存のドローン音が再生中であれば、停止して接続を切断します
    if (droneOscillator) {
        droneOscillator.stop();
        droneOscillator.disconnect();
    }

    // 新しいドローン音を作成して再生
    droneOscillator = audioContext.createOscillator();
    droneOscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4の音
    droneOscillator.connect(audioContext.destination);
    droneOscillator.start();
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
    noteOscillator.stop(audioContext.currentTime + 0.5); // 0.5秒後に停止

    displayInterval(randomInterval);
});

function displayInterval(interval) {
    const intervals = ["P1", "m2", "M2", "m3", "M3", "P4", "Tritone", "P5", "m6", "M6", "m7", "M7"];
    document.getElementById('noteInfo').innerText = `再生したノート: ${intervals[interval]}`;
}
