// Global variables
let currentPage = 1; // Current page number
const cardsPerPage = 3; // Number of cards per page

// Fetch the CSV file containing titles and links
fetch('news.csv')
  .then(response => response.text())
  .then(csvData => {
    // Parse CSV data to extract titles and links
    const rows = csvData.split('\n').map(row => row.split(','));
    
    // Fetch the images and create cards dynamically
    const carouselContainer = document.getElementById('carousel-container');
    rows.forEach(async (row, index) => { // Make the loop async to use await inside
      // Extract title and link from the row
      const [id, title, link] = row;

      // Create a new card element
      const card = document.createElement('div');
      card.classList.add('card');

      // Create an image element
      const imageElement = document.createElement('img');
      imageElement.classList.add('card-image');
      
      // Check if either .jpg or .JPG exists
      const photoUrl = await getPhotoUrl(id);
      imageElement.src = photoUrl;
      imageElement.alt = title; // Alt text for accessibility
      card.appendChild(imageElement);

      // Create a title element
      const titleElement = document.createElement('h2');
      titleElement.textContent = title;
      card.appendChild(titleElement);

      // Create a link element
      const linkElement = document.createElement('a');
      linkElement.href = link.trim(); // Trim to remove leading/trailing whitespace
      linkElement.textContent = 'Go to link';
      linkElement.target = '_blank'; // Open link in a new tab
      card.appendChild(linkElement);

      // Append the card to the carousel container
      carouselContainer.appendChild(card);

      // Hide cards that are not on the current page
      if (index >= cardsPerPage) {
        card.style.display = 'none';
      }
    });
  })
  .catch(error => console.error('Error fetching CSV:', error));

// Function to handle next page
function nextPage() {
  const cards = document.querySelectorAll('.card');
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  if (currentPage < totalPages) {
    for (let i = startIndex; i < endIndex; i++) {
      cards[i].style.display = 'none';
      cards[i + cardsPerPage].style.display = 'block';
    }
    currentPage++;
  }
}

// Function to handle previous page
function prevPage() {
  const cards = document.querySelectorAll('.card');
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const startIndex = (currentPage - 2) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  if (currentPage > 1) {
    for (let i = startIndex; i < endIndex; i++) {
      cards[i].style.display = 'block';
      cards[i + cardsPerPage].style.display = 'none';
    }
    currentPage--;
  }
}

async function getPhotoUrl(id) {
  try {
    // Check if either .jpg or .JPG exists
    if (await checkImageExists(`news_photos/${id}.jpg`)) {
      return `news_photos/${id}.jpg`;
    } else if (await checkImageExists(`news_photos/${id}.JPG`)) {
      return `news_photos/${id}.JPG`;
    } else {
      return 'news_photos/no_image.jpg'; // Return no_image.jpg if neither exists
    }
  } catch (error) {
    console.error('Error checking image existence:', error);
    return 'news_photos/no_image.jpg'; // Return no_image.jpg in case of error
  }
}

// Function to check if an image exists
async function checkImageExists(imageUrl) {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking image existence:', error);
    return false;
  }
}
