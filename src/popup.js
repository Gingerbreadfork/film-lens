import './app.css';

const ratingsCache = new Map();

function showLoading() {
  const loadingEl = document.createElement('div');
  loadingEl.id = 'loading';
  loadingEl.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50';
  loadingEl.innerHTML = `
    <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
  `;
  document.body.appendChild(loadingEl);
}

function hideLoading() {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.remove();
}

function showToast(message, type = 'error') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 p-4 rounded-lg text-white ${
    type === 'error' ? 'bg-red-500' : 'bg-green-500'
  } transition-opacity duration-300`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

async function fetchMovieInfo(title) {
  showLoading();
  try {
    if (ratingsCache.has(title)) {
      return ratingsCache.get(title);
    }

    const apiKey = import.meta.env.VITE_OMDB_API_KEY;
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === 'True') {
      ratingsCache.set(title, data);
      return data;
    }
    return null;
  } catch (error) {
    showToast('Failed to fetch movie information. Please try again.');
    return null;
  } finally {
    hideLoading();
  }
}

function updateUI(data) {
  const movieInfo = document.getElementById('movie-info');
  const errorMessage = document.getElementById('error-message');

  if (!data) {
    movieInfo.classList.add('hidden');
    errorMessage.textContent = 'Movie not found. Please try another title.';
    errorMessage.classList.remove('hidden');
    return;
  }

  document.getElementById('movie-poster').src = data.Poster !== 'N/A' ? data.Poster : '';
  document.getElementById('movie-title').textContent = data.Title;
  document.getElementById('movie-year').textContent = data.Year;
  document.getElementById('movie-runtime').textContent = data.Runtime;
  document.getElementById('movie-rated').textContent = data.Rated;
  document.getElementById('movie-genre').textContent = data.Genre;
  document.getElementById('movie-plot').textContent = data.Plot;
  document.getElementById('movie-director').textContent = `Director: ${data.Director}`;
  document.getElementById('movie-actors').textContent = `Cast: ${data.Actors}`;
  document.getElementById('movie-writer').textContent = `Writer: ${data.Writer}`;
  document.getElementById('movie-language').textContent = `Language: ${data.Language}`;
  document.getElementById('movie-country').textContent = `Country: ${data.Country}`;
  document.getElementById('movie-boxoffice').textContent = data.BoxOffice !== 'N/A' ? `Box Office: ${data.BoxOffice}` : '';
  document.getElementById('movie-awards').textContent = data.Awards;

  const ratingsContainer = document.getElementById('movie-ratings');
  ratingsContainer.innerHTML = data.Ratings.map(rating => `
    <div class="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors">
      <div class="text-xs text-gray-400 mb-1">${rating.Source}</div>
      <div class="text-lg font-semibold text-yellow-400">${rating.Value}</div>
    </div>
  `).join('');

  errorMessage.classList.add('hidden');
  movieInfo.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('movie-search');

  searchButton.addEventListener('click', async () => {
    const title = searchInput.value.trim();
    if (title) {
      const data = await fetchMovieInfo(title);
      updateUI(data);
    }
  });

  searchInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const title = searchInput.value.trim();
      if (title) {
        const data = await fetchMovieInfo(title);
        updateUI(data);
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      const movieInfo = document.getElementById('movie-info');
      movieInfo.classList.add('hidden');
    }
  });
}); 