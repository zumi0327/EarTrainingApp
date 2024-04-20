const audioContext = new AudioContext();
let droneSource = null;  // ドローン音のソースノード
let noteSource = null;   // ノートのソースノード
let sampleBuffer = null; // サンプルバッファを保持

async function loadSample(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return audioContext.decodeAudioData(arrayBuffer);
}

function playSample(buffer, frequency) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;  // ループを有効にする
    source.loopStart = 0.1;  // ループ開始位置（秒）
    source.loopEnd = 5;  // ループ終了位置（秒、バッファ全体を使用）
    
    // ピッチ（周波数）を調整するためのplaybackRateを設定
    const baseFrequency = 440; // サンプルの元のピッチがA4（440Hz）だと仮定
    source.playbackRate.value = frequency / baseFrequency;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = frequency * 2;  // フィルター周波数はピッチに依存せず、音のクリアさを保持
    source.connect(filter);
    filter.connect(audioContext.destination);
    source.start();
    return source;
}

document.addEventListener('DOMContentLoaded', async () => {
    // サンプルをロード
    sampleBuffer = await loadSample('https://raw.githubusercontent.com/zumi0327/EarTrainingApp/main/el_piano_sample.mp3');
    droneSource = playSample(sampleBuffer, 440); // デフォルトでA4の周波数で再生開始
    noteSource = playSample(sampleBuffer, 440); // デフォルトでA4の周波数で再生開始
});

document.getElementById('playNoteButton').addEventListener('click', () => {
    const randomInterval = Math.floor(Math.random() * 12); // 0から11までのランダムな値
    const frequency = getRandomFrequency() * Math.pow(2, randomInterval / 12); // ドローン音に基づくランダムな音程を計算
    if (noteSource) {
        noteSource.stop();  // 既存のノートを停止
    }
    noteSource = playSample(sampleBuffer, frequency); // バッファを使用してサンプルを再生
    const stopTime = audioContext.currentTime + 10; // 10秒後に停止
    noteSource.stop(stopTime);

    setTimeout(() => {
        noteSource.disconnect();
        displayInterval(randomInterval);
    }, 10000); // 10000ミリ秒 = 10秒
});

function displayInterval(interval) {
    const intervals = ["P1", "m2", "M2", "m3", "M3", "P4", "Tritone", "P5", "m6", "M6", "m7", "M7"];
    document.getElementById('noteInfo').innerText = `再生したノート: ${intervals[interval]}`;
}

function getRandomFrequency() {
    const baseFrequency = 220; // A3（基本となる低いAの周波数）
    const maxSteps = 12; // 1オクターブ分の半音ステップ
    const randomStep = Math.floor(Math.random() * maxSteps); // 0から11のランダムな値
    return baseFrequency * Math.pow(2, randomStep / 12); // ランダムな音高を計算
}
