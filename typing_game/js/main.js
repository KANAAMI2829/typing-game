'use strict';

const HOME_BUTTON        = document.getElementById('Home_Button');
const SETTINGS_BUTTON    = document.getElementById('Settings_Button');
const SETTINGS_SCREEN    = document.getElementById('Settings_Screen');
const CHECKMARK_BUTTON   = document.getElementById('CheckMark_Button');
const ACCOUNT_BUTTON     = document.getElementById('Account_Button');
const ACCOUNTINFO_POPUP  = document.getElementById('AccountInfo_Popup');
const HELP_BUTTON        = document.getElementById('Help_Button');
const HELP_POPUP         = document.getElementById('Help_Popup');
const GAME_MODE          = document.getElementById('Game_Mode');
const EN_DTL             = document.getElementById('en_dtl');
const GRADE              = document.getElementById('Grade');
const PG_DTL             = document.getElementById('pg_dtl');
const LANG               = document.getElementById('Lang');
const TIME_LIMIT_VALUE   = document.getElementById('Time_Limit_Value');
const RANKING            = document.getElementById('Ranking');
const RANKING_BUTTON     = document.getElementById('Ranking_Button');
const RANKING_SCREEN     = document.getElementById('Ranking_Screen');
const RETURN_ARROW       = document.getElementById('Return_Arrow');
const CLOSE_BUTTON       = document.getElementById('Close_Button');
const ACCOUNT_CLOSE      = document.getElementById('Account_Close');
const MENU               = document.getElementById('Menu');
const BACKGROUND         = document.getElementById('Background');
const ACCOUNT_BACKGROUND = document.getElementById('Account_Background');
const TYPING_GAME        = document.getElementById('Typing_Game');
const TIMER_SPACE        = document.getElementById('Timer_Space');
const TIMER              = document.getElementById('Timer');
const COUNT_DOWN         = document.getElementById('Count_Down');
const COUNT_DOWN_NUMBER  = document.getElementById('Count_Down_Number');
const JAPANESE           = document.getElementById('Japanese');
const SETTING_STATE      = document.getElementById('Setting_State');
const STATE_MODE         = document.getElementById('State_Mode');
const STATE_DETAIL       = document.getElementById('State_Detail');
const STATE_TIMELIMIT    = document.getElementById('State_TimeLimit');
const HIRAGANA_SPACE     = document.getElementById('Hiragana_Space');
const HIRAGANA           = document.getElementById('Hiragana');
const NOW_HIRAGANA       = document.getElementById('Now_Hiragana');
const TYPED_HIRAGANA     = document.getElementById('Typed_Hiragana');
const ROMAJI             = document.getElementById('Romaji');
const TYPED_ROMAJI       = document.getElementById('Typed_Romaji');
const HINT_ROMAJI        = document.getElementById('Hint_Romaji');
const MISS_ALERT         = document.getElementById('Miss_Alert');
const COUNT_SPACE        = document.getElementById('Count_Space');
const RANK_SPACE         = document.getElementById('Rank_Space');
const GOOD_COUNTER       = document.getElementById('Good_Counter');
const MISS_COUNTER       = document.getElementById('Miss_Counter');
const WPM_RESULT         = document.getElementById('WPM_Result');
const ACCURACY_RESULT    = document.getElementById('Accuracy_Result');
const SCORE_RESULT       = document.getElementById('Score_Result');
const RANK_RESULT        = document.getElementById('Rank_Result');
const MISS               = document.getElementById('Miss');
const WPM                = document.getElementById('WPM');
const SCORE              = document.getElementById('Score');
const RANK               = document.getElementById('Rank');
const RESTART            = document.getElementById('Restart');


let GOOD = document.getElementById('Good');
let ACCURACY = document.getElementById('Accuracy');
let TimeLimit = 60 * 1000;
let isSetting = false;
let isRanking = false;
let isAccountInfo = false;
let isHelping = false;
let isPlaying = false;
let isRestartReady = false;
let isReady = true;
let ENmode = false;
let PGmode = false;
let Typed_Time = Date.now();
let StartTime;
let Finish;
let TypeKey;
let TypedKey;
let Now_Hiragana;
let Hiragana_Index;
let Typed_Hiragana;
let Romaji;
let HintRomaji;
let Romaji_Index;
let Typed_Romaji;
let Random_Reibun;
let Now_Reibun_Number;
let GoodCount;
let MissCount;
let CorrectCount = 0;


HOME_BUTTON.addEventListener('click', () => returnHome());

SETTINGS_BUTTON.addEventListener('click', () => goSettings());

HELP_BUTTON.addEventListener('click', () => goHelp());

CHECKMARK_BUTTON.addEventListener('click', () => returnHome());

if (isLogin) {
  RANKING_BUTTON.addEventListener('click', () => goRanking());
  ACCOUNT_BUTTON.addEventListener('click', () => goAccountInfo());
}

// ゲーム中の処理
document.addEventListener('keydown', e => {
  if (isRestartReady) {
    if (e.key === 'Escape' || e.key.match(/\s/) !== null) {
      restartAnimation();
      isRestartReady = false;
      return false;
    }
  }
  let x = Date.now() - Typed_Time;

  if (x === 0) {
    startOver();
    alert('不正を感知しました\nエラーコード:001');
    return false;
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
  HintRomaji = HINT_ROMAJI.textContent;
  GoodCount = GOOD.textContent;
  MissCount = MISS.textContent;
  Now_Hiragana = aimai();

  // 正誤判定処理
  if (ENmode === true) {
    if (TypeKey === HintRomaji) {
      Romaji_Index++;
      GoodCount++;
      GOOD.textContent = GoodCount;
      Typed_Time = Date.now();
      HINT_ROMAJI.textContent = '';
      if (TYPED_ROMAJI.textContent === '') {
        if (x < 50) {
          startOver();
          alert('不正を感知しました\nエラーコード:002');
          return false;
        }
      }
      changeTypedHintRomajiColor(HintRomaji);
      if (Romaji === '') replaceReibun(0, 0);
    } else if (HintRomaji === '' && TypeKey === Romaji[0]) {
      Romaji_Index++;
      GoodCount++;
      GOOD.textContent = GoodCount;
      Typed_Time = Date.now();
      if (TYPED_ROMAJI.textContent === '') {
        if (x < 50) {
          startOver();
          alert('不正を感知しました\nエラーコード:002');
          return false;
        }
      }
      changeTypedRomajiColor(Romaji);
      replaceReibun(Romaji_Index, Typed_Romaji.length + Romaji.length);
    } else {
      if (ROMAJI.style.color === 'whitesmoke') MissCount++;
      MISS.textContent = MissCount;
      ROMAJI.style.color = '#a7b1be';
      TypedKey = TypedKey.slice(0, -1);
      missAnimation();
    }
  } else {
    if (TypeKey === Romaji[0]) {
      Romaji_Index++;
      GoodCount++;
      GOOD.textContent = GoodCount;
      Typed_Time = Date.now();
      if (TYPED_ROMAJI.textContent === '') {
        if (x < 100) {
          startOver();
          alert('不正を感知しました\nエラーコード:002');
          return false;
        }
      }
      changeTypedRomajiColor(Romaji);
      replaceReibun(Romaji_Index, Typed_Romaji.length + Romaji.length);
    } else {
      MissCount++;
      MISS.textContent = MissCount;
      ROMAJI.style.color = '#a7b1be';
      TypedKey = TypedKey.slice(0, -1);
      missAnimation();
    }
  }
});
