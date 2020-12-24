import React from "react";
import {useEffect, useState} from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import queryString from 'query-string'

// const serverUrl = 'http://localhost:8080';
const serverUrl = 'https://calsync-env.eba-wsszxvch.us-east-1.elasticbeanstalk.com';
const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&' +
                 'scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly%20email&' +
                 'response_type=code&' +
                 'client_id=809758834696-bnm6pb62roqcv967j2s68t9qrbloindl.apps.googleusercontent.com&' +
                 `redirect_uri=${serverUrl}%2Foauth2callback`
const localizer = momentLocalizer(moment)

console.log('authUrl: ', authUrl);

function App() {
  const [events, setEvents] = useState();
  const {email} = queryString.parse(window.location.search);

  useEffect(() => {
    !events && email && fetch(serverUrl + `/events?email=${email}`)
      .then(res => res.json())
      .then(res => setEvents(res))
      .catch(err => console.log(err));
  })

  function authCalendar() {
    window.location.replace(authUrl);
  }

  const rbcEvents = (events && events.filter((event) => {
    // return false;
    return event.event_obj.start && event.event_obj.start.dateTime && 
           event.event_obj.end && event.event_obj.end.dateTime &&
           (event.event_obj.status !== 'cancelled')
  }).map((event, i) => {
    return {
      start: moment(event.event_obj.start.dateTime).toDate(),
      end: moment(event.event_obj.end.dateTime).toDate(),
      title: event.event_obj.summary,
      allDay: false,
      id: i
    }
  })) || []
  console.log(rbcEvents);

  return (
        <div>
          {!email && 
            <button 
              id="authorize-calendar-button" 
              onClick={authCalendar}
              style={{display: 'block', margin: 'auto' }}
            >
              Authorize calendar access
            </button>}
          {email && <div style={{margin: 'auto', textAlign: 'center' }}>{email}</div>}
          {events && <Calendar
            localizer={localizer}
            events={rbcEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 800, width: 800, margin: 'auto' }}
          />}
        </div>
  );
}

export default App;
