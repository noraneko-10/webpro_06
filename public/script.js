"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const postForm = document.getElementById("postForm");
  const searchInput = document.getElementById("search");
  const postsList = document.getElementById("posts");

  const renderPosts = (posts) => {
    postsList.innerHTML = "";
    posts.forEach(post => {
      const li = document.createElement("li");
      li.className = "post";
      li.dataset.id = post.id; // 投稿IDをデータ属性として保存
      li.innerHTML = `
        <strong>${post.name}</strong>: ${post.message}
        <button class="like-btn" data-id="${post.id}">いいね (${post.likes})</button>
        <button class="edit-btn" data-id="${post.id}">編集</button>
        <button class="delete-btn" data-id="${post.id}">削除</button>
      `;
      postsList.appendChild(li);
    });

    attachEventListeners(); // イベントリスナーを再設定
  };

  const attachEventListeners = () => {
    // 「いいね」ボタンのクリックイベント
    document.querySelectorAll(".like-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        const res = await fetch(`/post/${id}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (res.ok) {
          const data = await res.json();
          const postElement = document.querySelector(`.post[data-id="${id}"]`);
          const likeButton = postElement.querySelector(".like-btn");
          likeButton.innerText = `いいね (${data.likes})`; // 「いいね」数をリアルタイム更新
        }
      });
    });

    // 「編集」ボタンのクリックイベント
    document.querySelectorAll(".edit-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        const newMessage = prompt("新しいメッセージを入力してください:");
        if (newMessage) {
          const res = await fetch(`/post/${id}/edit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: newMessage }),
          });
          if (res.ok) fetchPosts();
        }
      });
    });

    // 「削除」ボタンのクリックイベント
    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        const res = await fetch(`/post/${id}/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (res.ok) fetchPosts();
      });
    });
  };

  // 投稿を取得して表示
  const fetchPosts = async () => {
    const res = await fetch("/posts");
    const data = await res.json();
    renderPosts(data);
  };

  // 投稿の送信
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;
    const res = await fetch("/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
    const data = await res.json();
    if (data.success) fetchPosts();
  });

  // 投稿の検索
  searchInput.addEventListener("input", async (e) => {
    const keyword = e.target.value;
    const res = await fetch("/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword }),
    });
    const data = await res.json();
    renderPosts(data.results);
  });

  // 初回の投稿表示
  fetchPosts();
});
