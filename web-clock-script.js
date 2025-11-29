// ==========================================
// 1. 定数・設定の定義
// ==========================================

// --- DOM要素の取得 ---
const titleDisplay = document.getElementById('titleDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const instructionText = document.getElementById('usefulExpression');
const startStopBtn = document.getElementById("startstop");
const resetBtn = document.getElementById("reset");

// 時間追加ボタン
const add10MinBtn = document.getElementById('tenMin');
const add1MinBtn = document.getElementById('oneMin');
const add10SecBtn = document.getElementById('tenSec');

// --- 音声データの設定（ここがリファクタリングの核！） ---
// ※IDはHTML側の定義と一致させる必要があります
const soundData = {
  cat: {
    selectBtnId: 'catSound',
    trialBtnId: 'catTrial',
    files: ['cat-sounds/猫の鳴き声1.mp3', 'cat-sounds/猫の鳴き声2.mp3', 'cat-sounds/猫ニャーニャー.mp3', 'cat-sounds/猫ニャーニャー_2.mp3', 'cat-sounds/猫ニャーニャー_3.mp3', 'cat-sounds/リアルな猫の鳴き声_3.mp3'],
    bg: 'sound-background/cutiestCat.png'
  },
  bird: {
    selectBtnId: 'birdSound',
    trialBtnId: 'birdTrial',
    files: ['bird-sounds/モスケミソサザイのさえずり.mp3', 'bird-sounds/カッコウの鳴き声.mp3', 'bird-sounds/オナガ.mp3', 'bird-sounds/キジバトのさえずり1.mp3', 'bird-sounds/キビタキのさえずり.mp3', 'bird-sounds/スズメが鳴く朝.mp3'],
    bg: 'sound-background/cutiestBird.jpg'
  },
  nature: {
    selectBtnId: 'natureSound',
    trialBtnId: 'natureTrial',
    files: ['nature-sounds/fall_riverside_dawn.mp3', 'nature-sounds/たき火.mp3', 'nature-sounds/海岸1.mp3', 'nature-sounds/激しい雨.mp3', 'nature-sounds/風-そよ風.mp3', 'nature-sounds/風に揺れる草木2.mp3', 'nature-sounds/木枯らし・風に吹かれる落ち葉.mp3'],
    bg: 'sound-background/relaxNature.jpg'
  },
  other: {
    selectBtnId: 'otherSound',
    trialBtnId: 'otherTrial',
    files: ['other-sounds/目玉焼きを焼く.mp3', 'other-sounds/缶を開ける.mp3', 'other-sounds/カーテンを開ける (1).mp3', 'other-sounds/缶ジュースを開ける2.mp3', 'other-sounds/焼きそばを焼く1.mp3', 'other-sounds/ふすまを閉める.mp3'],
    bg: 'sound-background/otherSound.jpg'
  }
};


// ==========================================
// 2. 状態管理変数
// ==========================================
let remainingTime = 0;       // 残り時間（秒）
let timerInterval = null;    // setIntervalのID
let isRunning = false;       // タイマー実行中フラグ
let activeAudio = null;      // 現在再生中のAudioオブジェクト
let currentSoundFiles = null; // 選択されたカテゴリの音声ファイルリスト


// ==========================================
// 3. 共通関数（ロジック）
// ==========================================

/**
 * 時間を表示形式(00:00:00)に変換
 */
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

/**
 * 画面表示を更新
 */
function updateDisplay() {
  const timeStr = formatTime(remainingTime);
  timerDisplay.textContent = timeStr;
  titleDisplay.textContent = timeStr;
}

/**
 * UIの表示モード切替（start/stop時のボタン表示制御）
 */
function setUiMode(mode) {
  const displayVal = (mode === 'running') ? 'none' : 'inline-block';
  const displayValBlock = (mode === 'running') ? 'none' : 'block';
  
  // 時間追加ボタン
  add10MinBtn.style.display = displayVal;
  add1MinBtn.style.display = displayVal;
  add10SecBtn.style.display = displayVal;
  
  // 指示テキスト
  instructionText.style.display = displayValBlock;
  
  // 試聴ボタン類をまとめて制御
  Object.values(soundData).forEach(data => {
    const trialBtn = document.getElementById(data.trialBtnId);
    if(trialBtn) trialBtn.style.display = displayVal;
  });
}

/**
 * 音声を再生（共通化）
 * @param {string[]} files 再生するファイルパスの配列
 * @param {boolean} loop ループ再生するかどうか
 */
function playRandomSound(files, loop) {
  stopAllSounds(); // 再生前に既存の音を止める
  
  if (!files || files.length === 0) return;

  const path = files[Math.floor(Math.random() * files.length)];
  const audio = new Audio(path);
  audio.loop = loop;
  audio.play().catch(e => console.log('再生エラー:', e)); // ブラウザ制限対策
  activeAudio = audio;
}

/**
 * 全ての音声を停止
 */
function stopAllSounds() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
}

/**
 * 音声カテゴリのセットアップ（コピペ排除の要！）
 */
function setupSoundCategory(data) {
  const selectBtn = document.getElementById(data.selectBtnId);
  const trialBtn = document.getElementById(data.trialBtnId);

  if (!selectBtn || !trialBtn) return; // 要素がなければスキップ

  // 選択ボタンのクリックイベント
  selectBtn.addEventListener('click', () => {
    if (isRunning) return;

    // 1. 再生リストをセット
    currentSoundFiles = data.files;

    // 2. 背景画像を変更
    timerDisplay.style.backgroundImage = `url("${data.bg}")`;
    timerDisplay.style.backgroundSize = 'contain';
    timerDisplay.style.backgroundPosition = 'center';

    // 3. ボタンの見た目を更新（他をinactive, 自分をactive）
    // 一旦すべての選択ボタンから active を消す
    Object.values(soundData).forEach(d => {
      const btn = document.getElementById(d.selectBtnId);
      if(btn) {
        btn.classList.remove('active-sound');
        btn.classList.add('inactive-sound');
      }
    });
    // クリックされたボタンだけ active にする
    selectBtn.classList.remove('inactive-sound');
    selectBtn.classList.add('active-sound');
  });

  // 試聴ボタンのクリックイベント
  trialBtn.addEventListener('click', () => {
    if (!isRunning) {
      playRandomSound(data.files, false); // false = ループしない
    }
  });
}

// ==========================================
// 4. イベントリスナー登録 & 初期化
// ==========================================

// 音声ボタンを一括セットアップ
Object.values(soundData).forEach(data => {
  setupSoundCategory(data);
});


// 時間追加ボタン
add10MinBtn.addEventListener('click', () => { if(!isRunning) { remainingTime += 600; updateDisplay(); }});
add1MinBtn.addEventListener('click', () => { if(!isRunning) { remainingTime += 60; updateDisplay(); }});
add10SecBtn.addEventListener('click', () => { if(!isRunning) { remainingTime += 10; updateDisplay(); }});

// スタート・ストップボタン
startStopBtn.addEventListener('click', () => {
  if (isRunning) {
    // --- ストップ処理 ---
    clearInterval(timerInterval);
    isRunning = false;
    stopAllSounds();
    
    startStopBtn.textContent = 'スタート';
    startStopBtn.style.backgroundColor = '#007bff';
    setUiMode('stopped');
  } else {
    // --- スタート処理 ---
    if (remainingTime === 0) return alert('時間を設定してください！');
    if (!currentSoundFiles) return alert('音を設定してください！');

    stopAllSounds(); // 試聴停止
    isRunning = true;
    startStopBtn.textContent = 'ストップ';
    startStopBtn.style.backgroundColor = '#f44336';
    setUiMode('running');

    timerInterval = setInterval(() => {
      remainingTime--;
      updateDisplay();
      
      // タイマー終了時
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        playRandomSound(currentSoundFiles, true); // アラーム再生（ループ）
       
      }
    }, 1000);
  }
});

// リセットボタン
resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  stopAllSounds();
  isRunning = false;
  remainingTime = 0;
  currentSoundFiles = null;
  
  updateDisplay();
  titleDisplay.textContent = 'やすらぎタイマー';
  timerDisplay.style.backgroundImage = 'none';
  
  startStopBtn.textContent = 'スタート';
  startStopBtn.style.backgroundColor = '#007bff';
  setUiMode('stopped');

  // ボタン選択状態の解除
  Object.values(soundData).forEach(d => {
    const btn = document.getElementById(d.selectBtnId);
    if(btn) {
      btn.classList.remove('active-sound');
      btn.classList.remove('inactive-sound');
    }
  });
});

// 初期表示
updateDisplay();
setUiMode('stopped');
