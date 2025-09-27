import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EventList({ refreshFlag }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/events/getAll')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, [refreshFlag]);

  // ...rest code



  return (
    <div>
      <h2>Event List</h2>
      <ul>
        {events.map(event => (
          <li key={event._id}>{event.title} - {event.date} </li>
        ))}
      </ul>
    </div>
  );
}

export default EventList;
