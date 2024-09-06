document.addEventListener('DOMContentLoaded', function () {
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Use 24-hour format
            timeZone: 'UTC'
        };
        return date.toLocaleString('en-GB', options).replace(',', '');
    }

    function fetchEvents() {
        fetch('/webhook/events')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('events-container');
                container.innerHTML = ''; // Clear previous events

                data.forEach(event => {
                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('event');

                    const formattedTimestamp = formatTimestamp(event.timestamp);
                    
                    let eventText = '';
                    if (event.action === 'push') {
                        eventText = `'${event.author}' pushed to '${event.to_branch}' on ${formattedTimestamp}`;
                    } else if (event.action === 'pull_request') {
                        eventText = `'${event.author}' submitted a pull request from '${event.from_branch}' to '${event.to_branch}' on ${formattedTimestamp}`;
                    } else if (event.action === 'merge') {
                        eventText = `'${event.author}' merged branch '${event.from_branch}' to '${event.to_branch}' on ${formattedTimestamp}`;
                    }

                    eventDiv.textContent = eventText;
                    container.appendChild(eventDiv);
                });
            });
    }

    // Fetch events every 15 seconds
    setInterval(fetchEvents, 15000);
    fetchEvents();
});
