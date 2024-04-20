const audioContext = new AudioContext();
let droneSource = null;  // ドローン音のソースノード
let noteSource = null;   // ノートのソースノード
let sampleBuffer = null; // サンプルバッファを保持
let droneFrequency = 440

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
        source.loopEnd = 5;
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
});

document.getElementById('startButton').addEventListener('click', () => {
    if (droneSource) {
        droneSource.stop();  // 既存のソースを停止
        droneSource.disconnect();
    }
     droneFrequency = getRandomFrequency(); // ドローン用のランダムな周波数を取得
    droneSource = playSample(sampleBuffer, droneFrequency, true); // バッファを使用してドローン音をループ再生
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
    const frequency = droneFrequency * Math.pow(2, randomInterval / 12); // ドローン音に基づくランダムな音程を計算
    if (noteSource) {
        noteSource.stop();  // 既存のノートを停止
        noteSource.disconnect();
    }
    noteSource = playSample(sampleBuffer, frequency); // バッファを使用してサンプルを再生
    
    setTimeout(() => {
        if (noteSource) {
            noteSource.disconnect(); // ソースがまだ接続されていれば切断
        }
        displayInterval(randomInterval);
    }, 5000); // 5000ミリ秒 = 5秒
    
    const stopTime = audioContext.currentTime + 5; // 5秒後に停止
    noteSource.stop(stopTime);
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


document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('circleOfFifthsContainer');
    const radius = 100; // 半径
    const centerX = 150; // コンテナの中心X
    const centerY = 150; // コンテナの中心Y

    circleOfFifths.forEach((note, index) => {
        const angle = (index / 12) * Math.PI * 2; // 360度を12等分
        const x = centerX + radius * Math.cos(angle) - 15; // ボタンの位置調整
        const y = centerY + radius * Math.sin(angle) - 15;

        const button = document.createElement('button');
        button.className = 'circleButton';
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        button.textContent = note;
        button.onclick = () => selectDegree(index); // 選択された音程のインデックスを取得

        container.appendChild(button);
    });
});

function selectDegree(index) {
    console.log("Selected degree:", circleOfFifths[index]);
    // ここで選択された度数を保存して後で使用
}

