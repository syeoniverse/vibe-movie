const API_KEY = "0585f97045a7594501c889e7499065a7";
const API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&region=KR&page=1`;
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

const CATEGORY_MAP = {
  "all": null,
  "drama": 18,
  "action": 28,
  "comedy": 35,
  "animation": 16,
  "sci-fi": 878
};

const BOOKING_MAP = {};

const moviesEl = document.getElementById("movies");
const errorEl = document.getElementById("error");
const filmCountEl = document.getElementById("film-count");
const categoryEls = document.querySelectorAll(".category");

let allMovies = [];

async function loadMovies() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    allMovies = data.results || [];
    renderMovies(allMovies);
  } catch (err) {
    console.error(err);
    errorEl.classList.remove("hidden");
  }
}

function renderMovies(list) {
  filmCountEl.textContent = `${list.length} FILMS`;
  moviesEl.innerHTML = list
    .map((movie) => {
      const poster = movie.poster_path
        ? `${IMG_BASE}${movie.poster_path}`
        : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23e9e9e9'/%3E%3Ctext x='50%25' y='50%25' fill='%23888888' font-size='20' text-anchor='middle' font-family='Arial'%3ENO IMAGE%3C/text%3E%3C/svg%3E";
      const date = movie.release_date || "미정";
      const releaseLabel = `상영일: ${date}`;
      const title = movie.title || "제목 미상";
      const key = title.toLowerCase();
      const bookingUrl = BOOKING_MAP[key] || (movie.id ? `https://www.themoviedb.org/movie/${movie.id}` : `https://www.themoviedb.org/search?query=${encodeURIComponent(title)}`);
      return `
        <a class="card" href="${bookingUrl}" target="_blank" rel="noreferrer">
          <div class="poster">
            <img src="${poster}" alt="${title}">
          </div>
          <h3 class="title">${title}</h3>
          <p class="meta">${releaseLabel}</p>
        </a>
      `;
    })
    .join("");
}

function filterByCategory(categoryKey) {
  const genreId = CATEGORY_MAP[categoryKey];
  const filtered = genreId
    ? allMovies.filter((movie) => (movie.genre_ids || []).includes(genreId))
    : allMovies;
  renderMovies(filtered);
}

categoryEls.forEach((el) => {
  el.addEventListener("click", () => {
    categoryEls.forEach((btn) => btn.classList.remove("active"));
    el.classList.add("active");
    const categoryKey = el.dataset.category || "all";
    filterByCategory(categoryKey);
  });
});

loadMovies();
