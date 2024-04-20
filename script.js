const audioContext = new AudioContext();
let droneSource = null;  // ドローン音のソースノード
let noteSource = null;   // ノートのソースノード
let sampleBuffer = null; // サンプルバッファを保持

async function loadSample(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return audioContext.decodeAudioData(arrayBuffer);
}

function playSample(buffer, frequency, loop = false) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;  // ループ設定の可変性を追加
    if (loop) {
        source.loopStart = 0;
        source.loopEnd = buffer.duration;
    }

    // ピッチ（周波数）を調整するためのplaybackRateを設定
    const baseFrequency = 440; // サンプルの元のピッチがA4（440Hz）だと仮定
    source.playbackRate.value = frequency / baseFrequency;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = frequency * 2;
    source.connect(filter);
    filter.connect(audioContext.destination);
    source.start();
    return source;
}

document.addEventListener('DOMContentLoaded', async () => {
    sampleBuffer = await loadSample('https://raw.githubusercontent.com/zumi0327/EarTrainingApp/main/el_piano_sample.mp3');
    droneSource = playSample(sampleBuffer, 440, true); // ドローン音をループ再生
    noteSource = playSample(sampleBuffer, 440); // ノート音を非ループで再生
});

document.getElementById('startButton').addEventListener('click', () => {
    if (droneSource) {
        droneSource.stop();  // 既存のソースを停止
        droneSource.disconnect();
    }
    const frequency = getRandomFrequency(); // ドローン用のランダムな周波数を取得
    droneSource = playSample(sampleBuffer, frequency, true); // バッファを使用してドローン音をループ再生
});

document.getElementById('stopButton').addEventListener('click', () => {
    if (droneSource) {
        droneSource.stop();  // ドローン音を停止
        droneSource.disconnect();  // 接続を切断
        droneSource = null;  // 参照をクリア
    }
});


document.getElementById('playNoteButton').addEventListener('click', () => {
    const randomInterval = Math.floor(Math.random() * 12); // 0から11までのランダムな値
    const frequency = getRandomFrequency() * Math.pow(2, randomInterval / 12); // ドローン音に基づくランダムな音程を計算
    if (noteSource) {
        noteSource.stop();  // 既存のノートを停止
        noteSource.disconnect();
    }
    noteSource = playSample(sampleBuffer, frequency); // バッファを使用してノートを再生
});

function getRandomFrequency() {
    const baseFrequency = 220; // A3（基本となる低いAの周波数）
    const maxSteps = 12; // 1オクターブ分の半音ステップ
    const randomStep = Math.floor(Math.random() * maxSteps); // 0から11のランダムな値
    return baseFrequency * Math.pow(2, randomStep / 12); // ランダムな音高を計算
}
