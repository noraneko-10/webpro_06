const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});



app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win )||0;
  let total = Number( req.query.total )||0;
  console.log( {hand, win, total});

  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  
  let judgement = '';
  if (hand === cpu) {
    judgement = '引き分け';
  } else if ((hand === 'グー' && cpu === 'チョキ') ||
            (hand === 'チョキ' && cpu === 'パー') ||
            (hand === 'パー' && cpu === 'グー')
         ) {
          judgement = '勝ち';
          win += 1;
  } 
 else {
    judgement = '負け';
  }
 
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});


// フォームを表示するエンドポイント
app.get('/mahjong', (req, res) => {
  res.sendFile(__dirname + '/mahjong.html'); // mahjong.htmlを提供
});

// サイコロの結果を計算するエンドポイント
app.get('/mahjong-result', (req, res) => {
  const players = Number(req.query.radio);

  // サイコロの出目（2〜12）を生成
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  const diceSum = dice1 + dice2;

  // 家の決定ロジック
  let house = '';
  if (players === 3) {
    if ([2, 5, 8, 11].includes(diceSum)) {
      house = '南家';
    } else if ([3, 6, 9, 12].includes(diceSum)) {
      house = '西家';
    } else {
      house = '東家';
    }
  } else if (players === 4) {
    if ([2, 6, 10].includes(diceSum)) {
      house = '南家';
    } else if ([3, 7, 11].includes(diceSum)) {
      house = '西家';
    } else if ([4, 8, 12].includes(diceSum)) {
      house = '北家';
    } else {
      house = '東家';
    }
  } else {
    res.send("3または4を選択してください。");
    return;
  }

  // 結果を表示用にまとめる
  const display = {
    players: players,
    dice1: dice1,
    dice2: dice2,
    diceSum: diceSum,
    house: house
  };

  // 結果をテンプレートに渡してレンダリング
  res.render('mahjong-result', display);
});


app.get("/acchimuitehoi", (req, res) => {
  let direction = req.query.direction; // プレイヤーの入力方向
  let win = Number(req.query.win) || 0; // 勝利数
  let total = Number(req.query.total) || 0; // 試合数

  // CPUのランダムな向き
  const directions = ["上", "下", "左", "右"];
  const cpuDirection = directions[Math.floor(Math.random() * 4)];

  // 勝敗の判定
  let judgement = "";
  if (direction === cpuDirection) {
    judgement = "負け";
  } else {
    judgement = "勝ち";
    win += 1;
  }

  total += 1;

  // 表示用データを作成
  const display = {
    your: direction,
    cpu: cpuDirection,
    judgement: judgement,
    win: win,
    total: total,
  };

  // レンダリング
  res.render("acchimuitehoi", display);
});

// フォーム表示エンドポイント
app.get("/acchimuitehoi-form", (req, res) => {
  res.render("acchimuitehoi-form", { win: 0, total: 0 });
});


app.listen(8080, () => console.log("Example app listening on port 8080!"));
