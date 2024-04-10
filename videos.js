// Global variables
const videosPerPage = 10; // Number of videos per page
let currentPage = 1; // Current page number
let videoData = []; // Array to store video data

// Function to parse CSV data and create video cards
function createVideoCards(csvData) {
    videoData = csvData.split('\n').map(row => row.split(','));
    displayVideos(currentPage);
}

// Function to display videos for a specific page
function displayVideos(pageNumber) {
    const startIndex = (pageNumber - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    const videosToShow = videoData.slice(startIndex, endIndex);

    const videoCardsContainer = document.getElementById('video-cards');
    videoCardsContainer.innerHTML = ''; // Clear previous videos

    videosToShow.forEach(video => {
        const [id, title, description, date, videoUrl] = video;

        // Create video card elements
        const videoCard = document.createElement('div');
        videoCard.classList.add('card');

        // Create thumbnail image
        const thumbnailUrl = `https://img.youtube.com/vi/${extractVideoId(videoUrl)}/maxresdefault.jpg`;
        const thumbnailImg = document.createElement('img');
        thumbnailImg.classList.add('card-thumbnail');
        thumbnailImg.src = thumbnailUrl;
        thumbnailImg.alt = 'Video Thumbnail';

        // Create video title
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;

        // Create video description
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = description;

        // Create video date
        const dateElement = document.createElement('p');
        dateElement.textContent = date;

        // Create video link
        const videoLink = document.createElement('a');
        videoLink.classList.add('card-link');
        videoLink.href = videoUrl;
        videoLink.textContent = 'Watch Video';
        videoLink.target = '_blank'; // Open in new tab

        // Append elements to video card
        videoCard.appendChild(thumbnailImg);
        videoCard.appendChild(titleElement);
        videoCard.appendChild(descriptionElement);
        videoCard.appendChild(dateElement);
        videoCard.appendChild(videoLink);

        // Append video card to container
        videoCardsContainer.appendChild(videoCard);
    });

    createPaginationControls();
}

// Function to create pagination controls
function createPaginationControls() {
    const totalPages = Math.ceil(videoData.length / videosPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear previous pagination

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Prev';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayVideos(currentPage);
        }
    });
    paginationContainer.appendChild(prevButton);

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayVideos(currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayVideos(currentPage);
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Function to extract YouTube video ID from URL
function extractVideoId(url) {
    const match = url.match(/[?&]v=([^?&]+)/);
    return match && match[1];
}

// Fetch CSV data and create video cards
fetch('videos.csv')
    .then(response => response.text())
    .then(createVideoCards)
    .catch(error => console.error('Error fetching CSV data:', error));
