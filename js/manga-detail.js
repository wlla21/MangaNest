const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const isLoggedIn = localStorage.getItem("isLoggedIn");

if (id) {
  fetch(`https://api.jikan.moe/v4/manga/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const manga = data.data;
      const detailDiv = document.getElementById("detail");
      const chapters = document.getElementById("chapter");
      const review = document.getElementById("review");
      const summary = document.getElementById("summary");

      detailDiv.innerHTML = `
        <div id="left">
          <h1>${manga.title}</h1>
          <canvas src="${manga.images.jpg.image_url}" alt="${manga.title}" id=""> </canvas>
          <button>Start Reading</button>
        </div>
        <div id="right">
          <p>Status: ${manga.status}</p>
          <p>Chapters: ${manga.chapters}</p>
          <p>Author: ${manga.authors.map((a) => a.name).join(", ")}</p>
          <p>Genres: ${manga.genres
            .map(
              (g) =>
                `<a href="viewMore.html?genre=${g.name.toLowerCase()}">${g.name}</a>`,
            )
            .join(", ")}</p>

          <div id="rating-container"></div>
          <p id="rating-value"></p>
        </div>
      `;

      summary.innerHTML = `
        <h3>Summary</h3>
        <p>${manga.synopsis}</p>
        <h3>Chapter (${manga.chapters || "?"})</h3>
      `;

      if (manga.chapters) {
        for (let i = 0; i < manga.chapters; i++) {
          chapters.innerHTML += `<p><a>Chapter ${manga.chapters - i}</a></p>`;
        }
      } else {
        chapters.style.display = "none";
      }

      const ratingContainer = document.getElementById("rating-container");
      const ratingText = document.getElementById("rating-value");

      let rating = 0;

      for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.innerHTML = `<i class="fa fa-star"></i>`;
        star.style.fontSize = "20px";
        star.style.cursor = "pointer";
        star.style.color = "gray";

        star.addEventListener("click", () => {
          const isLoggedIn = localStorage.getItem("isLoggedIn");

          if (!isLoggedIn) {
            alert("You must login to rate!");
            return;
          }

          rating = i;
          updateStars();
          ratingText.textContent = "Rating: " + rating;

          localStorage.setItem("rating_" + id, rating);
        });

        star.addEventListener("mouseover", () => highlightStars(i));
        star.addEventListener("mouseout", updateStars);

        ratingContainer.appendChild(star);
      }

      function highlightStars(value) {
        const stars = ratingContainer.children;
        for (let i = 0; i < stars.length; i++) {
          const icon = stars[i].querySelector("i");
          icon.style.color = i < value ? "gold" : "gray";
        }
      }
      function updateStars() {
        const stars = ratingContainer.children;
        for (let i = 0; i < stars.length; i++) {
          const icon = stars[i].querySelector("i");
          icon.style.color = i < rating ? "gold" : "gray";
        }
      }
      const savedRating = localStorage.getItem("rating_" + id);
      if (savedRating) {
        rating = parseInt(savedRating);
        updateStars();
        ratingText.textContent = "Rating: " + rating;
      }

      fetch(`https://api.jikan.moe/v4/manga/${id}/reviews`)
        .then((res) => res.json())
        .then((data) => {
          const reviews = data.data;

          if (reviews.length === 0) {
            review.innerHTML = `<p class="no-review">No reviews yet.</p>`;
            return;
          }

          review.innerHTML = `<h3 class="review-title">Reviews</h3>`;

          reviews.slice(0, 5).forEach((r) => {
            const reviewDate = new Date(r.date).toLocaleDateString();

            review.innerHTML += `
              <div class="review-card">
                <div class="review-header">
                  <img src="${r.user.images.jpg.image_url}" class="avatar">
                  <span class="username">${r.user.username}</span>
                  <span class="userdate">${reviewDate}</span>
                </div>
                <p class="review-text">
                  ${r.review.substring(0, 200)}...
                </p>
              </div>
            `;
          });
        });
    });
}
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
    <a href="mangaDetail.html?id=${manga.mal_id}">
      <img src="${manga.images.jpg.image_url}">
      <p>${manga.title}</p>
    </a>
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

const logoutBtn = document.getElementById("logout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.reload();
  });
}

const signin = document.getElementById("signin");
if (isLoggedIn == "true") {
  signin.style.display = "none";
} else {
  signin.style.display = "block";
}
const settingsIcon = document.getElementById("settings-icon");
function menuWed() {
  const menu = document.getElementById("menu");
  settingsIcon.onclick = () => {
    if (menu.style.display == "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
      menu.innerHTML = `<a href="../login.html" id="signIn">Sign In</a>
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
    } else {
      signInWed.style.display = "block";
    }
  };
}
menuWed();

if (localStorage.getItem("key") === null) {
  logoutBtn.style.display = "none";
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

const topBtn = document.getElementById("topBtn");
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
});
const footer = document.getElementById("footer");
const year = new Date().getFullYear();
footer.innerHTML = `<p>MangaNest @${year}</p>`;
