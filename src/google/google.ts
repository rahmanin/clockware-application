import { google } from 'googleapis';

const googleCalendarKeys = require('../../google.calendar.config.js')
const CALENDAR_ID = "kmdr3rc1pnjk3f2q4oa9505nj8@group.calendar.google.com";
const SCOPE_CALENDAR = 'https://www.googleapis.com/auth/calendar';
const SCOPE_EVENTS = 'https://www.googleapis.com/auth/calendar.events';

const googleAuthenticate = async() => {
  const jwtClient = new google.auth.JWT(
    googleCalendarKeys.client_email,
    null,
    googleCalendarKeys.private_key,
    [SCOPE_CALENDAR, SCOPE_EVENTS]
  );
  await jwtClient.authorize();
  return jwtClient;
}

const getEventIdByOrderId = async(order_id: number, auth: any) => {
  const eventsList = await google.calendar('v3').events.list({
    auth: auth,
    calendarId: CALENDAR_ID,
  })
  return eventsList.data.items.find(event => event.summary === `${order_id}`).id
}

export default {
  googleAuthenticate,
  getEventIdByOrderId,
  CALENDAR_ID
}