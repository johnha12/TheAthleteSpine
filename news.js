// Global variables
const newsPerPage = 10; // Number of news articles per page
let currentPage = 1; // Current page number
let newsData = []; // Array to store news data

// Function to parse CSV data and create news cards
function createNewsCards(csvData) {
    newsData = csvData.split('\n').map(row => row.split(','));
    displayNews(currentPage);
}

// Function to display news articles for a specific page
async function displayNews(pageNumber) {
    const startIndex = (pageNumber - 1) * newsPerPage;
    const endIndex = startIndex + newsPerPage;
    const newsToShow = newsData.slice(startIndex, endIndex);

    const newsCardsContainer = document.getElementById('news-cards');
    newsCardsContainer.innerHTML = ''; // Clear previous news articles

    for (const news of newsToShow) {
        const [id, title, link] = news;

        // Create news card elements
        const newsCard = document.createElement('div');
        newsCard.classList.add('card');

        // Create news title
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;

        // Create news link
        const linkElement = document.createElement('a');
        linkElement.classList.add('card-link');
        linkElement.href = link;
        linkElement.textContent = 'Read more';
        linkElement.target = '_blank'; // Open in new tab

        // Append elements to news card
        newsCard.appendChild(titleElement);
        newsCard.appendChild(linkElement);

        // Append news card to container
        newsCardsContainer.appendChild(newsCard);
    }

    createPaginationControls();
}

// Function to create pagination controls
function createPaginationControls() {
    const totalPages = Math.ceil(newsData.length / newsPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear previous pagination

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Prev';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayNews(currentPage);
        }
    });
    paginationContainer.appendChild(prevButton);

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayNews(currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayNews(currentPage);
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Fetch CSV data and create news cards
fetch('news.csv')
    .then(response => response.text())
    .then(createNewsCards)
    .catch(error => console.error('Error fetching CSV data:', error));
