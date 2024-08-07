// Global variables
const guestsPerPage = 10; // Number of guests per page
let currentPage = 1; // Current page number
let guestData = []; // Array to store guest data

// Function to parse CSV data and create guest cards
function createGuestCards(csvData) {
    guestData = csvData.split('\n').map(row => row.split(','));
    displayGuests(currentPage);
}

// Function to display guests for a specific page
async function displayGuests(pageNumber) {
    const startIndex = (pageNumber - 1) * guestsPerPage;
    const endIndex = startIndex + guestsPerPage;
    const guestsToShow = guestData.slice(startIndex, endIndex);

    const guestCardsContainer = document.getElementById('guest-cards');
    guestCardsContainer.innerHTML = ''; // Clear previous guests

    for (const guest of guestsToShow) {
        const [id, name, type, placeOfWork, videosFeatured, watchVideo, photoAvailable] = guest;

        // Create guest card elements
        const guestCard = document.createElement('div');
        guestCard.classList.add('card');

        // Create guest name
        const nameElement = document.createElement('h3');
        nameElement.textContent = name;

        // Create type
        const typeElement = document.createElement('h4');
        typeElement.textContent = type;

        // Create place of work
        const placeOfWorkElement = document.createElement('h4');
        placeOfWorkElement.textContent = placeOfWork;

        // Create guest videos featured
        const videosFeaturedElement = document.createElement('p');
        videosFeaturedElement.textContent = `Featured Video: ${videosFeatured}`;

        // Create guest Instagram link
        const watchVideoElement = document.createElement('a');
        watchVideoElement.classList.add('card-link');
        watchVideoElement.href = watchVideo;    // can change this to reference pdf link
        watchVideoElement.textContent = 'Watch this guest!';
        watchVideoElement.target = '_blank'; // Open in new tab

        // Append elements to guest card
        guestCard.appendChild(nameElement); // name
        guestCard.appendChild(typeElement); // title
        guestCard.appendChild(placeOfWorkElement);  // role
        // guestCard.appendChild(videosFeaturedElement);
        // guestCard.appendChild(watchVideoElement);    // Can uncomment to use for pdf link

        // Check if photo is available
        // const photoUrl = photoAvailable === 'true' ? `guest_photos/${id}.jpg` : 'guest_photos/no_image.jpg';

        let photoUrl;
        if (await checkImageExists(`team_photos/${id}.jpg`)) {
            photoUrl = `team_photos/${id}.jpg`;
        } else if (await checkImageExists(`team_photos/${id}.JPG`)) {
            photoUrl = `team_photos/${id}.JPG`;
        } else {
            photoUrl = 'team_photos/no_image.jpg';
        }
        

        // Create guest photo element
        const photoElement = document.createElement('img');
        photoElement.src = photoUrl;
        photoElement.alt = `${name}'s Photo`;
        photoElement.classList.add('guest-photo'); // Add the guest-photo class
        // Append guest photo to the beginning of the guest card
        guestCard.insertBefore(photoElement, guestCard.firstChild);



        // Append guest card to container
        guestCardsContainer.appendChild(guestCard);
    }

    createPaginationControls();
}

// Function to check if an image exists
async function checkImageExists(imageUrl) {
    try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Function to create pagination controls
function createPaginationControls() {
    const totalPages = Math.ceil(guestData.length / guestsPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear previous pagination

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Prev';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayGuests(currentPage);
        }
    });
    paginationContainer.appendChild(prevButton);

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayGuests(currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayGuests(currentPage);
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Fetch CSV data and create guest cards
fetch('meet_team.csv')
    .then(response => response.text())
    .then(createGuestCards)
    .catch(error => console.error('Error fetching CSV data:', error));
