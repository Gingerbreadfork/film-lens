import './app.css';

const ratingsCache = new Map();

function fetchMovieInfo(title) {
  if (ratingsCache.has(title)) {
    return Promise.resolve(ratingsCache.get(title));
  }

  const apiKey = '5b1cd2bb';
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      ratingsCache.set(title, data);
      return data;
    })
    .catch(() => null);
}

function createSearchPanel() {
  const panel = document.createElement('div');
  panel.className = 'fixed z-50 max-w-md p-4 text-white rounded-lg shadow-lg top-4 right-4 bg-black/90';
  panel.innerHTML = `
    <div class="text-lg font-bold mb-2">Film Lens</div>
    <input id="movie-search" type="text" placeholder="Enter movie title" class="w-full p-2 mb-2 text-black rounded" />
    <button id="search-button" class="w-full p-2 bg-blue-500 rounded">Search</button>
    <div id="movie-info" class="mt-4 text-sm space-y-2"></div>
  `;
  document.body.appendChild(panel);

  const searchButton = panel.querySelector('#search-button');
  const searchInput = panel.querySelector('#movie-search');
  const movieInfo = panel.querySelector('#movie-info');

  searchButton.addEventListener('click', () => {
    const title = searchInput.value.trim();
    if (title) {
      fetchMovieInfo(title).then((data) => {
        if (data) {
          movieInfo.innerHTML = `
            <div class="font-semibold">${data.Title} (${data.Year})</div>
            <div>Director: ${data.Director}</div>
            <div>Genre: ${data.Genre}</div>
            <div>Plot: ${data.Plot}</div>
            <div>Ratings:</div>
            <ul class="list-disc pl-5">
              ${data.Ratings.map(rating => `<li>${rating.Source}: ${rating.Value}</li>`).join('')}
            </ul>
          `;
        } else {
          movieInfo.innerHTML = '<div class="text-red-500">Movie not found.</div>';
        }
      });
    }
  });
}

createSearchPanel();
