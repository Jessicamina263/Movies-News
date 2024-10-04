document.addEventListener('DOMContentLoaded', function () {
    var menu = document.getElementById('optionsmenu');
    var menuButton = document.getElementById('menubutton');
    var options = [
        "Now Playing", "Popular", "Top Rated", "Trending", "UpComing", "Contact Us",
    ];

    function createMenuItems() {
        menu.innerHTML = '';
        options.forEach(function (option) {
            var menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.textContent = option;
            menu.appendChild(menuItem);
        });
    }
    createMenuItems();

    menuButton.addEventListener('click', function () {
        if (menu.classList.contains('open')) {
            menu.classList.remove('open');
        } else {
            menu.classList.add('open');
        }
    });

    var searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keyup', function (event) {
        if (event.target.value.length >= 3) {
            searchMovies(event.target.value);
        } else if (event.target.value.length === 0) {
            var moviesContainer = document.getElementById('moviesContainer');
            moviesContainer.innerHTML = '';
        }
    });

    var contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
    });
});

function searchMovies(query) {
    const apiKey = '34baaa39304e36b1a1982c584e7ce52a';
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                displayMovies(data.results);
            } else {
                showNoResultsMessage();
            }
        })
        .catch(error => console.error('Error fetching search results:', error));
}

function displayMovies(movies) {
    var moviesContainer = document.getElementById('moviesContainer');
    moviesContainer.innerHTML = '';
    movies.forEach(movie => {
        var movieCard = document.createElement('div');
        movieCard.style.margin = '10px';
        movieCard.style.textAlign = 'center';

        var img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w200/${movie.poster_path}`;
        img.alt = movie.title;
        img.style.width = '200px';
        img.style.height = '300px';
        movieCard.appendChild(img);

        var title = document.createElement('p');
        title.textContent = movie.title;
        title.style.color = 'white';
        movieCard.appendChild(title);

        moviesContainer.appendChild(movieCard);
    });
}

function showNoResultsMessage() {
    var moviesContainer = document.getElementById('moviesContainer');
    moviesContainer.innerHTML = '<p>No results found</p>';
}
