document.addEventListener('DOMContentLoaded', function () {
    var menu = document.getElementById('optionsmenu');
    var menuButton = document.getElementById('menubutton');
    var options = ["Now Playing", "Watch List", "Contact Us"];

    function createMenuItems() {
        menu.innerHTML = '';
        options.forEach(function (option) {
            var menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.textContent = option;
            menu.appendChild(menuItem);

            // Add navigation functionality to each menu option
            menuItem.addEventListener('click', function () {
                if (option === "Now Playing") {
                    navigateToSection('moviesSection');
                } else if (option === "Watch List") {
                    window.location.href = 'watchlist.html'; // Navigate to watchlist page
                } else if (option === "Contact Us") {
                    navigateToSection('contactForm');
                }
            });
        });
    }
    createMenuItems();

    menuButton.addEventListener('click', function () {
        menu.classList.toggle('open');
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

// Navigate to section on the same page or on index.html
function navigateToSection(sectionId) {
    if (window.location.pathname.endsWith('watchlist.html')) {
        // If on watchlist page, redirect to index.html with the section ID as a hash
        window.location.href = `index.html#${sectionId}`;
    } else {
        // If on index.html, scroll smoothly to the section
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    }
}

// Fetch and display movies based on search query
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

// Display search results with "Add to Watch List" functionality
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

        var addToWatchListButton = document.createElement('button');
        addToWatchListButton.textContent = "Add to Watch List";
        addToWatchListButton.style.color = 'white';
        addToWatchListButton.style.backgroundColor = 'rgb(194, 33, 87)';
        addToWatchListButton.style.border = 'none';
        addToWatchListButton.style.borderRadius = '5px';
        addToWatchListButton.style.padding = '5px 10px';
        addToWatchListButton.style.marginTop = '10px';

        // Save movie to watch list on click
        addToWatchListButton.addEventListener('click', function () {
            saveToWatchList(movie);
        });

        movieCard.appendChild(addToWatchListButton);
        moviesContainer.appendChild(movieCard);
    });
}

function showNoResultsMessage() {
    var moviesContainer = document.getElementById('moviesContainer');
    moviesContainer.innerHTML = '<p>No results found</p>';
}

// Save movie to localStorage watch list
function saveToWatchList(movie) {
    var watchList = JSON.parse(localStorage.getItem('watchList')) || [];
    // Avoid duplicates
    if (!watchList.some(m => m.id === movie.id)) {
        watchList.push(movie);
        localStorage.setItem('watchList', JSON.stringify(watchList));
        alert(`${movie.title} has been added to your Watch List!`);
    } else {
        alert(`${movie.title} is already in your Watch List.`);
    }
}

// Load and display watch list movies in watchlist.html
// Load and display watch list movies in watchlist.html
function loadWatchList() {
    var watchListContainer = document.getElementById('watchListContainer');
    var savedMovies = JSON.parse(localStorage.getItem('watchList')) || [];

    watchListContainer.innerHTML = '';
    
    if (savedMovies.length === 0) {
        // Show message if there are no movies in the watch list
        var noMoviesMessage = document.createElement('p');
        noMoviesMessage.textContent = "No movies to display";
        noMoviesMessage.style.color = 'white';
        noMoviesMessage.style.textAlign = 'center';
        watchListContainer.appendChild(noMoviesMessage);
    } else {
        // Display each movie in the watch list
        savedMovies.forEach(movie => {
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

            // Delete button
            var deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete From Watch List";
            deleteButton.style.color = 'white';
            deleteButton.style.backgroundColor = 'rgb(194, 33, 87)';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '5px';
            deleteButton.style.padding = '5px 10px';
            deleteButton.style.marginTop = '10px';

            // Remove movie from watch list on click
            deleteButton.addEventListener('click', function () {
                removeFromWatchList(movie.id);
            });

            movieCard.appendChild(deleteButton);
            watchListContainer.appendChild(movieCard);
        });
    }
}


// Function to remove a movie from the watch list
function removeFromWatchList(movieId) {
    var watchList = JSON.parse(localStorage.getItem('watchList')) || [];
    watchList = watchList.filter(movie => movie.id !== movieId);
    localStorage.setItem('watchList', JSON.stringify(watchList));
    loadWatchList(); // Reload the watch list after deletion
}

// Automatically load watch list if on watchlist.html
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('watchListContainer')) {
        loadWatchList();
    }
});

// Scroll to the top when the backbutton is clicked
document.addEventListener('DOMContentLoaded', function () {
    var backButton = document.querySelector('.backbutton');

    if (backButton) {
        backButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Smooth scrolling
            });
        });
    }
});