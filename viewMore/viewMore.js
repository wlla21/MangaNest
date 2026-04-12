const params = new URLSearchParams(window.location.search);
const settings = document.getElementById("settings");
const isLoggedIn = localStorage.getItem("isLoggedIn");
const genreList = [
  { name: "Action", id: 1 },
  { name: "Adventure", id: 2 },
  { name: "Comedy", id: 4 },
  { name: "Mystery", id: 7 },
  { name: "Drama", id: 8 },
  { name: "Ecchi", id: 12 },
  { name: "Historical", id: 13 },
  { name: "Shoujo", id: 25 },
  { name: "Yuri", id: 26 },
  { name: "Eroctica", id: 49 },
  { name: "Josei", id: 43 },
  { name: "Romance", id: 22 },
  { name: "Fantasy", id: 10 },
  { name: "Horror", id: 14 },
  { name: "Sci-Fi", id: 24 },
  { name: "Slice of Life", id: 36 },
  { name: "Sports", id: 30 },
  { name: "Yaoi", id: 28 },
  { name: "Award winning", id: 46 },
  { name: "Shounen", id: 27 },
  { name: "Avant Grade", id: 5 },
];
let titleName;
const genreMap = {
  action: 1,
  adventure: 2,
  comedy: 4,
  mystery: 7,
  drama: 8,
  ecchi: 12,
  historical: 13,
  shoujo: 25,
  yuri: 26,
  erotica: 49,
  josei: 43,
  romance: 22,
  fantasy: 10,
  horror: 14,
  "sci-fi": 24,
  "slice of life": 36,
  sports: 30,
  yaoi: 28,
  shounen: 27,
  "award winning": 46,
  "avant grade": 5,
};

let selectedGenres = [];
let selectedStatus = [];
let currentPage = 1;
let totalPages = 1;
const limit = 25;

const genreParam = decodeURIComponent(params.get("genre") || "")
  .toLowerCase()
  .trim();

const genreContainer = document.getElementById("genreFilters");

genreList.forEach((g) => {
  genreContainer.innerHTML += `
    <label>
      <input type="checkbox" value="${g.id}">
      ${g.name}
    </label>
  `;
});

if (genreParam && genreMap[genreParam]) {
  const genreId = genreMap[genreParam];

  selectedGenres = [genreId];

  document.querySelectorAll("#genreFilters input").forEach((input) => {
    if (Number(input.value) === genreId) {
      input.checked = true;
    }
  });
}

if (genreParam) {
  getTitle(genreParam);
}

getMangaByPage(currentPage);
document.getElementById("applyFilter").addEventListener("click", () => {
  selectedGenres = [
    ...document.querySelectorAll("#genreFilters input:checked"),
  ].map((el) => Number(el.value));

  selectedStatus = [...document.querySelectorAll(".status input:checked")].map(
    (el) => el.value,
  );

  titleName = genreList
    .filter((item) => selectedGenres.includes(item.id))
    .map((item) => item.name);

  getTitle(titleName.join(","));
  currentPage = 1;
  getMangaByPage(currentPage);
});

function getTitle(name) {
  document.getElementById("title").innerText = name.toUpperCase();
}

async function getMangaByPage(page) {
  try {
    let url = `https://api.jikan.moe/v4/manga?limit=${limit}&page=${page}`;

    if (selectedGenres.length > 0) {
      url += `&genres=${selectedGenres.join(",")}`;
    }

    if (selectedStatus.includes("complete")) {
      url += "&status=complete";
    } else if (selectedStatus.includes("publishing")) {
      url += "&status=publishing";
    }

    const res = await fetch(url);
    const data = await res.json();

    displayManga(data.data);

    const totalManga = data.pagination.items.total;
    totalPages = Math.ceil(totalManga / limit);

    generatePaginationButtons();
  } catch (error) {
    console.log("Error:", error);
  }
}

function displayManga(mangaList) {
  const container = document.getElementById("genre-results");
  container.innerHTML = "";

  mangaList.forEach((manga) => {
    const image =
      manga.images?.webp?.image_url ||
      manga.images?.jpg?.image_url ||
      "https://picsum.photos/200";

    container.innerHTML += `
      <a href="../manga-detail/mangaDetail.html?id=${manga.mal_id}">
        <div class="card">
          <img src="${image}" loading="lazy">
          <p>${manga.title}</p>
          <p>Chapter ${manga.chapters == "null" ? "Null" : manga.chapters}</p>
          <p>Chapter ${manga.chapters - 1 == -1 ? "Null" : manga.chapters - 1}</p>
        </div>
      </a>
    `;
  });
}

function generatePaginationButtons() {
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  const maxVisible = 4;
  let start = Math.max(1, currentPage - 1);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const prev = document.createElement("button");
  prev.innerText = "<";
  prev.style.padding = "5px 10px";
  prev.disabled = currentPage === 1;
  prev.onclick = () => {
    currentPage--;
    getMangaByPage(currentPage);
  };
  container.appendChild(prev);
  for (let i = start; i <= end; i++) {
    const btn = document.createElement("button");
    btn.classList.add = "paginationbtn";
    btn.innerText = i;

    if (i === currentPage) {
      btn.style.background = "#4c5fd7";
      btn.style.color = "#fff";
    }

    btn.onclick = () => {
      currentPage = i;
      getMangaByPage(i);
    };

    container.appendChild(btn);
  }

  // Ellipsis (...)
  if (end < totalPages - 1) {
    const dots = document.createElement("span");
    dots.innerText = " ... ";
    container.appendChild(dots);
  }

  if (end < totalPages) {
    const last = document.createElement("button");
    last.innerText = totalPages;

    last.onclick = () => {
      currentPage = totalPages;
      getMangaByPage(totalPages);
    };

    container.appendChild(last);
  }

  const next = document.createElement("button");
  next.innerText = ">";
  next.style.padding = "5px 10px";
  next.disabled = currentPage === totalPages;
  next.onclick = () => {
    currentPage++;
    getMangaByPage(currentPage);
  };
  container.appendChild(next);

  const select = document.createElement("select");
  select.style.margin = "0 10px";
  select.style.padding = "5px";
  for (let i = 1; i <= totalPages; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;

    if (i === currentPage) option.selected = true;

    select.appendChild(option);
  }

  select.onchange = () => {
    currentPage = parseInt(select.value);
    getMangaByPage(currentPage);
  };

  container.appendChild(select);
}

getMangaByPage(currentPage);

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
    <a href="manga-detail/mangaDetail.html?id=${manga.mal_id}">
      <img src="${manga.images.jpg.image_url}">
      <p>${manga.title}</p>
    </a>
    `;
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

const icon = document.getElementById("search-icon");
icon.onclick = () => {
  input.style.display = "block";
};

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
const topBtn = document.getElementById("top");
window.addEventListener("scroll", () => {
  if (scrollY > 200) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
});
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
