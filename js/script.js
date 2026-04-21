const header_btn1 = document.getElementById("header-btn1");
const header_btn2 = document.getElementById("header-btn2");

const reviewContainer = document.getElementById("review");
const settings = document.getElementById("settings");
const isLoggedIn = localStorage.getItem("isLoggedIn");
const headerInfo = document.getElementById("header-info");
let headerList = [];
let currentIndex = 0;

async function loadHeaderManga() {
  const res = await fetch(
    "https://api.jikan.moe/v4/manga?order_by=start_date&sort=desc&limit=10",
  );
  const data = await res.json();

  headerList = data.data;
  updateHeader();
}

function updateHeader(data) {
  if (headerList.length === 0) return;

  const manga = headerList[currentIndex];
  const headerInfo = document.getElementById("header-info");
  headerInfo.innerHTML = `
          <a href="mangaDetail.html?id=${manga.mal_id}">
          <img id="img" src="${manga.images.jpg.image_url}"/>
          <div class="manga-box">
            <h2 id="title-manga">${manga.title}</h2>
            <p>Status: <span id="status">${manga.status}</span></p>
            <p>Genres: <span id="genres">${manga.genres.map((g) => g.name).join(", ")}</span></p>
            <p>Author: <span id="author">${manga.authors.map((a) => a.name).join(", ")}</span></p>
          </div>
          </a>`;
}

header_btn2.onclick = () => {
  if (headerList.length === 0) return;
  currentIndex = (currentIndex + 1) % headerList.length;
  updateHeader();
};

header_btn1.onclick = () => {
  if (headerList.length === 0) return;
  currentIndex = (currentIndex - 1 + headerList.length) % headerList.length;
  updateHeader();
};

setInterval(() => {
  if (headerList.length === 0) return;
  currentIndex = (currentIndex + 1) % headerList.length;
  updateHeader();
}, 5000);

const input = document.getElementById("searchInput");
const results = document.getElementById("results");

let debounceTimer;
let selectedIndex = -1;
let currentResults = [];

input.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    searchManga(input.value);
  }, 400);
});

async function searchManga(query) {
  if (!query) {
    results.innerHTML = "";
    return;
  }

  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/manga?q=${query}&limit=5`,
    );
    const data = await res.json();

    currentResults = data.data;
    displayResults(currentResults);
  } catch (err) {
    console.log("Search error:", err);
  }
}

function displayResults(list) {
  results.innerHTML = "";
  selectedIndex = -1;

  list.forEach((manga, i) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <img src="${manga.images.jpg.image_url}">
      <p>${manga.title}</p>
    `;

    div.onclick = () => goToDetail(manga.mal_id);

    results.appendChild(div);
  });
}

input.addEventListener("keydown", (e) => {
  const items = results.children;

  if (e.key === "ArrowDown") {
    selectedIndex++;
    if (selectedIndex >= items.length) selectedIndex = 0;
  }

  if (e.key === "ArrowUp") {
    selectedIndex--;
    if (selectedIndex < 0) selectedIndex = items.length - 1;
  }

  if (e.key === "Enter" && currentResults[selectedIndex]) {
    goToDetail(currentResults[selectedIndex].mal_id);
  }

  highlight(items);
});

function highlight(items) {
  [...items].forEach((el, i) => {
    el.style.background = i === selectedIndex ? "#2c2755" : "";
  });
}
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-center")) {
    results.innerHTML = "";
  }
});

function goToDetail(id) {
  window.location.href = `mangaDetail.html?id=${id}`;
}

const mangaContainer = document.getElementById("manga-container");
async function loadPopular() {
  try {
    const res = await fetch(
      "https://api.jikan.moe/v4/top/manga?filter=bypopularity&limit=10",
    );
    const data = await res.json();

    const pop = document.getElementById("popular");

    data.data.forEach((m, i) => {
      const div = document.createElement("div");
      div.className = "popularManga";

      div.innerHTML = `
        <h3>${i + 1}</h3>
        <img src="${m.images.jpg.image_url}">
        <p>${m.title}</p>
      `;

      div.onclick = () => goToDetail(m.mal_id);

      pop.appendChild(div);
    });
  } catch (err) {
    console.log("Popular error:", err);
  }
}
async function loadYaoi() {
  try {
    const res = await fetch(
      "https://api.jikan.moe/v4/manga?genres=28&order_by=members&sort=desc&start_date=2018-01-01&sfw=false&limit=10",
    );
    const data = await res.json();

    const yaoi = document.getElementById("yaoi");

    data.data.forEach((m, i) => {
      const div = document.createElement("div");
      div.className = "yaoiManga";

      div.innerHTML = `
        <img src="${m.images.jpg.image_url}">
        <p>${m.title}</p>
      `;

      div.onclick = () => goToDetail(m.mal_id);

      yaoi.appendChild(div);
    });
  } catch (err) {
    console.log("Yaoi error:", err);
  }
}
async function loadComdey() {
  try {
    const res = await fetch(
      "https://api.jikan.moe/v4/manga?genres=4&order_by=members&sort=desc&start_date=2018-01-01&sfw=false&limit=10",
    );
    const data = await res.json();

    const comedy = document.getElementById("comedy");

    data.data.forEach((m, i) => {
      const div = document.createElement("div");
      div.className = "comedyManga";

      div.innerHTML = `
        <img src="${m.images.jpg.image_url}">
        <p>${m.title}</p>
      `;

      div.onclick = () => goToDetail(m.mal_id);

      comedy.appendChild(div);
    });
  } catch (err) {
    console.log("Comedy error:", err);
  }
}
async function loadShoujo() {
  try {
    const res = await fetch(
      "https://api.jikan.moe/v4/manga?genres=25&order_by=members&sort=desc&start_date=2018-01-01&sfw=false&limit=10",
    );
    const data = await res.json();

    const shoujo = document.getElementById("shoujo");

    data.data.forEach((m, i) => {
      const div = document.createElement("div");
      div.className = "shoujoManga";

      div.innerHTML = `
        <img src="${m.images.jpg.image_url}">
        <p>${m.title}</p>
      `;

      div.onclick = () => goToDetail(m.mal_id);

      shoujo.appendChild(div);
    });
  } catch (err) {
    console.log("Shoujo error:", err);
  }
}

async function init() {
  await loadHeaderManga();
  await loadPopular();
  await loadYaoi();
  await loadShoujo();
  await loadComdey();
  await getRecentReviews();
}

init();

const logoutBtn = document.getElementById("logout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.reload();
  });
}

const commentBox = document.getElementById("commentBox");
const signin = document.getElementById("signin");
if (isLoggedIn != "true") {
  commentBox.style.display = "none";
}
if (isLoggedIn == "true") {
  signin.style.display = "none";
}
console.log(isLoggedIn);
const settingsIcon = document.getElementById("settings-icon");
function menuWed() {
  const menu = document.getElementById("menu");
  settingsIcon.onclick = () => {
    if (menu.style.display == "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
      menu.innerHTML = `<a href="login.html" id="signIn">Sign In</a>
          <a href="#" id="logOut">Sign Out</a>`;
    }
    const signInWed = document.getElementById("signIn");
    const signOutWed = document.getElementById("logOut");

    signOutWed.onclick = () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      window.location.reload();
    };
    if (isLoggedIn == "true") {
      signInWed.style.display = "none";
      commentBox.style.display = "block";
    } else {
      signInWed.style.display = "block";
      commentBox.style.display = "none";
    }
  };
}
menuWed();
if (localStorage.length == 0) {
  logoutBtn.style.display = "none";
} else {
  logoutBtn.style.display = "block";
}

const reviewerImg = document.getElementById("reviewerImg");
const userName = localStorage.getItem("username");
function updateUserImg() {
  if (userName) {
    let userFirstLetter = userName.charAt(0);
    reviewerImg.innerHTML = `<p id="userImg">${userFirstLetter.toUpperCase()}</p>`;
  } else {
    reviewerImg.innerHTML = `<i class="fa fa-user-circle"></i>`;
  }
}
updateUserImg();
const topBtn = document.getElementById("top");
window.addEventListener("scroll", () => {
  if (scrollY > 200) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
});

const publishBtn = document.getElementById("publish");
publishBtn.onclick = setReview;

const user = document.getElementById("user");
const userComment = document.getElementById("usercomment");

let today = new Date();
let date = today.toISOString().split("T")[0];
function setReview() {
  let reviewName = JSON.parse(localStorage.getItem("reviewerName")) || [];
  reviewName.push(user.value);
  localStorage.setItem("reviewerName", JSON.stringify(reviewName));
  let reviewDate = JSON.parse(localStorage.getItem("reviewerDate")) || [];
  reviewDate.push(date);
  localStorage.setItem("reviewerDate", JSON.stringify(reviewDate));
  let reviewText = JSON.parse(localStorage.getItem("reviewerText")) || [];
  reviewText.push(userComment.value);
  localStorage.setItem("reviewerText", JSON.stringify(reviewText));
  location.reload();
}

function updateReview() {
  let userFirstLetter = userName ? userName.charAt(0) : " ";
  let name = JSON.parse(localStorage.getItem("reviewerName")) || [];
  let date = JSON.parse(localStorage.getItem("reviewerDate")) || [];
  let text = JSON.parse(localStorage.getItem("reviewerText")) || [];
  let arrayLength = JSON.parse(localStorage.getItem("reviewerName"));
  for (let i = 0; i < arrayLength.length; i++) {
    reviewContainer.innerHTML += `
           <div class="review-card">
             <div class="review-header">
              <p id="reviewer-img">${userFirstLetter}</p>
              <span class="username">${name[i]}</span>
              <span class="userdate">${date[i]}</span>
            </div>
             <p class="review-text">
               ${text[i]};
            </p></div>
        `;
  }
}
async function getRecentReviews() {
  updateReview();
  try {
    const res = await fetch(
      "https://api.jikan.moe/v4/manga?order_by=start_date&sort=desc&limit=10",
    );
    const mangaData = await res.json();
    const mangaList = mangaData.data;
    for (const manga of mangaList) {
      const reviewRes = await fetch(
        `https://api.jikan.moe/v4/manga/${manga.mal_id}/reviews`,
      );
      const reviewData = await reviewRes.json();
      const reviews = reviewData.data.slice(0, 1);

      reviews.forEach((r) => {
        const reviewDate = new Date(r.date).toLocaleDateString();
        reviewContainer.innerHTML += `
          <div class="review-card">
            <div class="review-header">
              <img src="${r.user.images?.jpg?.image_url || "https://picsum.photos/50"}" class="avatar">
              <span class="username">${r.user.username}</span>
              <span class="userdate">${reviewDate}</span>
            </div>
            <p class="review-text">
              <strong>${manga.title}:</strong> ${r.review.substring(0, 200)}...
            </p>
          </div>
        `;
      });
    }
  } catch (error) {
    console.log("Error fetching recent reviews:", error);
    reviewContainer.innerHTML += "<p>Failed to load reviews.</p>";
  }
}
const footer = document.getElementById("footer");
const year = new Date().getFullYear();
footer.innerHTML = `<p>MangaNest @${year}</p>`;
