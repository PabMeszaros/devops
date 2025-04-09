document.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById('events');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const retryButton = document.getElementById('retry-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
  
    // Function to format date
    function formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  
    // Function to check if registration is open
    function isRegistrationOpen(eventDate) {
      const eventTime = new Date(eventDate).getTime();
      const now = new Date().getTime();
      const twoWeeksBefore = eventTime - (14 * 24 * 60 * 60 * 1000);
      return now < twoWeeksBefore;
    }
  
    // Function to create event cards
    function createEventCard(event) {
      const registrationOpen = isRegistrationOpen(event.date);
      
      const eventCard = document.createElement('div');
      eventCard.classList.add('event-card');
      
      eventCard.innerHTML = `
        <div class="event-image">
          <img src="${event.logo}" alt="${event.location} event logo">
        </div>
        <div class="event-content">
          <span class="event-date">${formatDate(event.date)}</span>
          <h3 class="event-location">${event.location}</h3>
          <p class="event-details">Join the DevOps community for a day of learning, sharing, and networking.</p>
          <div class="event-footer">
            <div class="event-status ${registrationOpen ? 'open' : 'closed'}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${registrationOpen ? 
                  '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>' : 
                  '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line>'}
              </svg>
              ${registrationOpen ? 'Registration Open' : 'Registration Closed'}
            </div>
            <button class="event-action">${registrationOpen ? 'Register Now' : 'View Details'}</button>
          </div>
        </div>
      `;
      
      return eventCard;
    }
  
    // Function to load events
    function loadEvents() {
      loadingElement.style.display = 'flex';
      errorElement.style.display = 'none';
      eventsContainer.innerHTML = '';
      
      fetch("events.json")
        .then(response => {
          if (!response.ok) {
            throw new Error("Error loading JSON file");
          }
          return response.json();
        })
        .then(data => {
          loadingElement.style.display = 'none';
          
          if (data.length === 0) {
            eventsContainer.innerHTML = '<p class="no-events">No events found. Check back later!</p>';
            return;
          }
          
          // Sort events by date (newest first)
          data.sort((a, b) => new Date(a.date) - new Date(b.date));
          
          // Create and append event cards
          data.forEach(event => {
            const eventCard = createEventCard(event);
            eventsContainer.appendChild(eventCard);
          });
        })
        .catch(error => {
          console.error("Error:", error);
          loadingElement.style.display = 'none';
          errorElement.style.display = 'flex';
        });
    }
  
    // Filter functionality
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        // Here you would implement actual filtering logic
        // For now, just reload all events
        loadEvents();
      });
    });
  
    // Retry button
    retryButton.addEventListener('click', loadEvents);
  
    // Initial load
    loadEvents();
  });