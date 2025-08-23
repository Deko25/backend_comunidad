const postBtn = document.getElementById("postBtn");
const postText = document.getElementById("postText");
const privacySelect = document.getElementById("privacy");
const feed = document.getElementById("feed");

const codeInput = document.getElementById("codeInput");
const imageInput = document.getElementById("imageInput");
const fileInput = document.getElementById("fileInput");

const previewArea = document.getElementById("preview-area");

let posts = [];
let tempCode = null;
let tempImage = null;
let tempFile = null;

postBtn.addEventListener("click", () => {
  const text = postText.value.trim();
  const privacy = privacySelect.value;

  if (!text && !tempCode && !tempImage && !tempFile) {
    alert("Escribe algo o sube un archivo para postear.");
    return;
  }

  addPost(text, privacy, tempCode, tempImage, tempFile);

  // resetear
  postText.value = "";
  tempCode = null;
  tempImage = null;
  tempFile = null;
  previewArea.innerHTML = "";
  previewArea.style.display = "none";
});

codeInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      tempCode = ev.target.result;
      updatePreview();
    };
    reader.readAsText(file);
  }
});

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      tempImage = ev.target.result;
      updatePreview();
    };
    reader.readAsDataURL(file);
  }
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    tempFile = {
      name: file.name,
      url: URL.createObjectURL(file)
    };
    updatePreview();
  }
});

function updatePreview() {
  previewArea.innerHTML = "";
  previewArea.style.display = "flex";

  if (tempCode) {
    const codeBlock = document.createElement("pre");
    codeBlock.textContent = tempCode.substring(0, 300) + (tempCode.length > 300 ? "..." : ""); // limitar preview
    previewArea.appendChild(codeBlock);
  }

  if (tempImage) {
    const img = document.createElement("img");
    img.src = tempImage;
    previewArea.appendChild(img);
  }

  if (tempFile) {
    const fileLink = document.createElement("a");
    fileLink.href = tempFile.url;
    fileLink.textContent = "📂 " + tempFile.name;
    fileLink.target = "_blank";
    previewArea.appendChild(fileLink);
  }
}

function addPost(text, privacy, code, image, file) {
  const newPost = {
    user: "User Coder",
    time: "Just now",
    text,
    privacy,
    code,
    image,
    file
  };
  posts.unshift(newPost);
  renderPosts();
}

function renderPosts() {
  feed.innerHTML = "";
  posts.forEach(post => {
    const postEl = document.createElement("div");
    postEl.classList.add("post");

    let codeBlock = post.code ? `<pre><code>${post.code}</code></pre>` : "";
    let imageBlock = post.image ? `<img src="${post.image}" alt="post image">` : "";
    let fileBlock = post.file ? `<a href="${post.file.url}" download="${post.file.name}">📂 ${post.file.name}</a>` : "";

    postEl.innerHTML = `
      <div class="post-header">
        <img src="assets/default-user.png" alt="user">
        <div>
          <strong>${post.user}</strong><br>
          <small>${post.time} · ${post.privacy}</small>
        </div>
      </div>
      <div class="post-content">
        <p>${post.text}</p>
        ${codeBlock}
        ${imageBlock}
        ${fileBlock}
      </div>
    `;
    feed.appendChild(postEl);
  });
}
