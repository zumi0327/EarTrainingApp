const audioContext = new AudioContext();
let droneOscillator = null;
let noteOscillator = null;

function getRandomFrequency() {
    const baseFrequency = 220; // A3（基本となる低いAの周波数）
    const maxSteps = 24; // 2オクターブ分の半音ステップ
    const randomStep = Math.floor(Math.random() * maxSteps); // 0から23までのランダムな値
    return baseFrequency * Math.pow(2, randomStep / 12); // ランダムな音高を計算
}

document.getElementById('startButton').addEventListener('click', () => {
    if (droneOscillator) {
        droneOscillator.stop();
        droneOscillator.disconnect();
    }
    const frequency = getRandomFrequency(); // ドローン用のランダムな周波数を取得
    droneOscillator = audioContext.createOscillator();
    droneOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // ランダムな周波数の音
    droneOscillator.connect(audioContext.destination);
    droneOscillator.start();
    console.log("Drone frequency: " + frequency); // 周波数の確認用ログ
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
    const frequency = droneOscillator.frequency.value * Math.pow(2, randomInterval / 12); // ドローン音に基づくランダムな音程を計算
    noteOscillator = audioContext.createOscillator();
    noteOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    noteOscillator.connect(audioContext.destination);
    noteOscillator.start();

    // 10秒後にノートを停止し、その後音程を表示する
    const stopTime = audioContext.currentTime + 10;
    noteOscillator.stop(stopTime);

    setTimeout(() => {
        noteOscillator.disconnect();
        displayInterval(randomInterval);
    }, 10000); // 10000ミリ秒 = 10秒
});

function displayInterval(interval) {
    const intervals = ["P1", "m2", "M2", "m3", "M3", "P4", "Tritone", "P5", "m6", "M6", "m7", "M7"];
    document.getElementById('noteInfo').innerText = `再生したノート: ${intervals[interval]}`;
}
const audioContext = new AudioContext();
let droneOscillator = null;
let noteOscillator = null;

function getRandomFrequency() {
    const baseFrequency = 220; // A3（基本となる低いAの周波数）
    const maxSteps = 12; // 1オクターブ分の半音ステップ
    const randomStep = Math.floor(Math.random() * maxSteps); // 0から23のランダムな値
    return baseFrequency * Math.pow(2, randomStep / 12); // ランダムな音高を計算
}

document.getElementById('startButton').addEventListener('click', () => {
    if (droneOscillator) {
        droneOscillator.stop();
        droneOscillator.disconnect();
    }
    const frequency = getRandomFrequency(); // ドローン用のランダムな周波数を取得
    droneOscillator = audioContext.createOscillator();
    droneOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // ランダムな周波数の音
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
    const frequency = droneOscillator.frequency.value * Math.pow(2, randomInterval / 12); // ドローン音に基づくランダムな音程を計算
    noteOscillator = audioContext.createOscillator();
    noteOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    noteOscillator.connect(audioContext.destination);
    noteOscillator.start();

    // 10秒後にノートを停止し、その後音程を表示する
    const stopTime = audioContext.currentTime + 10;
    noteOscillator.stop(stopTime);

    setTimeout(() => {
        noteOscillator.disconnect();
        displayInterval(randomInterval);
    }, 10000); // 10000ミリ秒 = 10秒
});

function displayInterval(interval) {
    const intervals = ["P1", "-2/-9", "P2/9", "-3", "3", "P4/11", "-5/+11", "P5", "-6/-13", "6/13", "m7", "M7"];
    document.getElementById('noteInfo').innerText = `再生したノート: ${intervals[interval]}`;
}


