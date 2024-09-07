document.addEventListener('DOMContentLoaded', function () {
    function getSuffix(day) {
        switch (day % 10) { //suffix added acc to remainder
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const day = date.getUTCDate();
        const month = date.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' });
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes().toString().padStart(2, '0'); //ensures 0 is added if returns single digit
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours % 12 || 12; //return 12 in result is 0
        const suffix = getSuffix(day);
        return `${day}${suffix} ${month} ${year} - ${formattedHour}:${minutes} ${period} UTC`;
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
                    } else if (event.action === 'opened') {
                        eventText = `'${event.author}' submitted a pull request from '${event.from_branch}' to '${event.to_branch}' on ${formattedTimestamp}`;
                    } else if (event.action === 'closed') {
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
