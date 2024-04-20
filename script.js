const audioContext = new AudioContext();
let droneSource = null;  // ドローン音のソースノード
let noteSource = null;   // ノートのソースノード

async function loadSample(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return audioContext.decodeAudioData(arrayBuffer);
}

function playSample(buffer, frequency) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;  // ループを有効にする
    source.loopStart = 0;  // ループ開始位置（秒）
    source.loopEnd = buffer.duration;  // ループ終了位置（秒、バッファ全体を使用）
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = frequency;  // 周波数に合わせてフィルターを調整
    source.connect(filter);
    filter.connect(audioContext.destination);
    source.start();
    return source;
}

document.addEventListener('DOMContentLoaded', async () => {
    // サンプルをロード
    const sampleBuffer = await loadSample('https://github.com/zumi0327/EarTrainingApp/blob/main/el_piano_sample.mp3');
    droneSource = playSample(sampleBuffer, 440); // デフォルトでA4の周波数で再生開始
    noteSource = playSample(sampleBuffer, 440); // デフォルトでA4の周波数で再生開始
});

document.getElementById('startButton').addEventListener('click', () => {
    const frequency = getRandomFrequency(); // ドローン用のランダムな周波数を取得
    if (droneSource) {
        droneSource.stop();  // 既存のソースを停止
    }
    droneSource = playSample(droneSource.buffer, frequency); // バッファを使用してサンプルを再生
});

document.getElementById('stopButton').addEventListener('click', () => {
    if (droneSource) {
        droneSource.stop();  // ドローン音を停止
        droneSource.disconnect();
        droneSource = null;
    }
    if (noteSource) {
        noteSource.stop();  // ノートを停止
        noteSource.disconnect();
        noteSource = null;
    }
});

document.getElementById('playNoteButton').addEventListener('click', () => {
    const randomInterval = Math.floor(Math.random() * 12); // 0から11までのランダムな値
    const frequency = droneSource.frequency.value * Math.pow(2, randomInterval / 12); // ドローン音に基づくランダムな音程を計算
    if (noteSource) {
        noteSource.stop();  // 既存のノートを停止
    }
    noteSource = playSample(noteSource.buffer, frequency); // バッファを使用してサンプルを再生
});

function getRandomFrequency() {
    const baseFrequency = 220; // A3（基本となる低いAの周波数）
    const maxSteps = 12; // 1オクターブ分の半音ステップ
    const randomStep = Math.floor(Math.random() * maxSteps); // 0から11のランダムな値
    return baseFrequency * Math.pow(2, randomStep / 12); // ランダムな音高を計算
}
