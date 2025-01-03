"use strict";
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.static("public")); // /publicを静的ファイルのルートに設定

// 仮のデータベース
let bbs = [];

// 新規投稿
app.post("/post", (req, res) => {
  const { name, message } = req.body;
  const post = { id: bbs.length + 1, name, message, likes: 0, createdAt: new Date() };
  bbs.push(post);
  res.json({ success: true, post });
});

// 投稿に「いいね」
app.post("/post/:id/like", (req, res) => {
  const id = parseInt(req.params.id);
  const post = bbs.find(p => p.id === id);
  if (post) {
    post.likes += 1;
    res.json({ success: true, likes: post.likes });
  } else {
    res.status(404).json({ success: false, error: "Post not found" });
  }
});

// 投稿の検索
app.post("/search", (req, res) => {
  const { keyword } = req.body;
  const results = bbs.filter(p => p.message.includes(keyword) || p.name.includes(keyword));
  res.json({ success: true, results });
});

// 投稿の編集
app.post("/post/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const { message } = req.body;
  const post = bbs.find(p => p.id === id);
  if (post) {
    post.message = message;
    res.json({ success: true, post });
  } else {
    res.status(404).json({ success: false, error: "Post not found" });
  }
});

// 投稿の削除
app.post("/post/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const index = bbs.findIndex(p => p.id === id);
  if (index !== -1) {
    bbs.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: "Post not found" });
  }
});

// サーバー起動
app.listen(8080, () => console.log("Server running on http://localhost:8080"));
