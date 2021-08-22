'use strict';

const HOME_BUTTON       = document.getElementById('Home_Button');
const SETTINGS_BUTTON   = document.getElementById('Settings_Button');
const SETTINGS_SCREEN   = document.getElementById('Settings_Screen');
const CHECKMARK_BUTTON  = document.getElementById('CheckMark_Button');
const HELP_BUTTON       = document.getElementById('Help_Button');
const HELP_POPUP        = document.getElementById('Help_Popup');
const GAME_MODE         = document.getElementById('Game_Mode');
const EN_DTL            = document.getElementById('en_dtl');
const GRADE             = document.getElementById('Grade');
const PG_DTL            = document.getElementById('pg_dtl');
const LANG              = document.getElementById('Lang');
const TIME_LIMIT_VALUE  = document.getElementById('Time_Limit_Value');
const CLOSE_BUTTON      = document.getElementById('Close_Button');
const MENU              = document.getElementById('Menu');
const BACKGROUND        = document.getElementById('Background');
const TYPING_GAME       = document.getElementById('Typing_Game');
const TIMER_SPACE       = document.getElementById('Timer_Space');
const TIMER             = document.getElementById('Timer');
const COUNT_DOWN        = document.getElementById('Count_Down');
const COUNT_DOWN_NUMBER = document.getElementById('Count_Down_Number');
const JAPANESE          = document.getElementById('Japanese');
const SETTING_STATE     = document.getElementById('Setting_State');
const STATE_MODE        = document.getElementById('State_Mode');
const STATE_TIMELIMIT   = document.getElementById('State_TimeLimit');
const HIRAGANA_SPACE    = document.getElementById('Hiragana_Space');
const HIRAGANA          = document.getElementById('Hiragana');
const NOW_HIRAGANA      = document.getElementById('Now_Hiragana');
const TYPED_HIRAGANA    = document.getElementById('Typed_Hiragana');
const ROMAJI            = document.getElementById('Romaji');
const TYPED_ROMAJI      = document.getElementById('Typed_Romaji');
const MISS_ALERT        = document.getElementById('Miss_Alert');
const COUNT_SPACE       = document.getElementById('Count_Space');
const RANK_SPACE        = document.getElementById('Rank_Space');
const GOOD_COUNTER      = document.getElementById('Good_Counter');
const MISS_COUNTER      = document.getElementById('Miss_Counter');
const WPM_RESULT        = document.getElementById('WPM_Result');
const ACCURACY_RESULT   = document.getElementById('Accuracy_Result');
const SCORE_RESULT      = document.getElementById('Score_Result');
const RANK_RESULT       = document.getElementById('Rank_Result');
const MISS              = document.getElementById('Miss');
const WPM               = document.getElementById('WPM');
const SCORE             = document.getElementById('Score');
const RANK              = document.getElementById('Rank');
const RESTART           = document.getElementById('Restart');


let GOOD = document.getElementById('Good');
let ACCURACY = document.getElementById('Accuracy');
let TimeLimit = 30 * 1000;
let isSetting = false;
let isHelping = false;
let isPlaying = false;
let isRestartReady = false;
let isReady = true;
let ENmode = false;
let PGmode = false;
let StartTime;
let Finish;
let TypeKey;
let TypedKey;
let Now_Hiragana;
let Hiragana_Index;
let Typed_Hiragana;
let Romaji;
let Romaji_Index;
let Typed_Romaji;
let Random_Reibun;
let Now_Reibun_Number;
let GoodCount;
let MissCount;
let CorrectCount = 0;


HOME_BUTTON.addEventListener('click', () => returnHome());

SETTINGS_BUTTON.addEventListener('click', () => goSettings());

CHECKMARK_BUTTON.addEventListener('click', () => returnHome());

HELP_BUTTON.addEventListener('click', () => goHelp());

// ゲーム中の処理
document.addEventListener('keydown', e => {
  if (isRestartReady) {
    if (e.key === 'Escape' || e.key.match(/\s/) !== null) {
      restartAnimation();
      isRestartReady = false;
      return false;
    }
  }

  if (e.key === 'h' && isSetting) returnHome();

  if (isSetting || isHelping) return;

  if (e.key === 's' && isPlaying === false) goSettings();

  if (e.key === 'Escape' && isPlaying === true) startOver();

  if (ENmode === true && gamePreparationEN(e.key)) return;

  if (PGmode === true && gamePreparationPG(e.key)) return;

  if (PGmode === false && gamePreparation(e.key)) return;

  // [A-Za-z0-9]と指定された記号以外は通さない
  if (COUNT_DOWN_NUMBER.textContent === ''
  || JAPANESE.textContent === '' 
  || filterInputKey(e.key)
  || isPlaying === false
  || isRestartReady === true
  || isReady === true) {
    return;
  }

  TypeKey = `${ROMAJI_TABLE_1[`${e.key}`]}`;
  TypedKey = TypedKey + TypeKey;
  Typed_Romaji = TYPED_ROMAJI.textContent;
  Romaji = ROMAJI.textContent;
  GoodCount = GOOD.textContent;
  MissCount = MISS.textContent;
  Now_Hiragana = aimai();

  // 正誤判定処理
  if (TypeKey === Romaji[0]) {
    Romaji_Index++;
    GoodCount++;
    GOOD.textContent = GoodCount;
    changeTypedRomajiColor(ROMAJI.textContent);
    replaceReibun(Romaji_Index, Typed_Romaji.length + Romaji.length);
  } else {
    if (ENmode !== true) MissCount++;
    else if (ROMAJI.style.color === 'whitesmoke') MissCount++;
    MISS.textContent = MissCount;
    ROMAJI.style.color = '#a7b1be';
    TypedKey = TypedKey.slice(0, -1);
    missAnimation();
  }
});
