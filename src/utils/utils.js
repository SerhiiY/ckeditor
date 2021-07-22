import moment from 'moment-timezone';

const SECOND  = 1000;
const MINUTE  = 60 * SECOND;
const HOUR    = 60 * MINUTE;
const DAY     = 24 * HOUR;

export const parseHHMMSS = (milliseconds) => {
  let time = moment.utc(milliseconds).format(
    milliseconds < HOUR ? 'mm:ss'    :
    milliseconds < DAY  ? 'HH:mm:ss' :
    'DDD'
  );

  if (!(milliseconds < DAY)) time = `${(time - 1)} day(s)`;

  return time;
};

const getMomentFormat = (format) => {
  switch (format) {
    case "date":      return 'MM/DD/YYYY';
    case "time":      return 'h : mm A (z)';
    case "datetime":  return 'MM/DD/YYYY h : mm A (z)';
    default:          return format;
  };
};

export const parseDefaultTimeZone = ({ ms, format = "datetime", tz = 'America/Los_Angeles'}) => {
  let _format = getMomentFormat(format);
  const datetimeTZ = moment.utc(ms).tz(tz);
  return !!format ? datetimeTZ.format(_format) : datetimeTZ.toISOString();
};

export const getWordCount = (content) => {
  const trimmedText = content.trim();
  return !trimmedText ? 0 : trimmedText.split(/\s+/).length;
};

export const isProjectAudit = () => {
  const random = Math.random() * 100;
  return random <= 20;
};

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const eventEmitter = {
  _events: {},
  dispatch(event, data) {
    console.log(`[EventEmitter]: dispatching event "${event}"`);
    if (!this._events[event]) return;
    this._events[event].forEach(callback => callback(data))
  },
  on(event, callback) {
    console.log(`[EventEmitter]: subscribe event "${event}"`);
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(callback);
  },
  off(event) {
    console.log(`[EventEmitter]: unsubscribe event "${event}"`);
    if (!this._events[event]) return;
    delete this._events[event];
  },
};


export function debounce(func, wait, immediate) {
  let timeout;

  return function executedFunction() {	    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(this, arguments);
    };

    const callNow = immediate && !timeout;
	
    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
	
    if (callNow) func.apply(this, arguments);
  };
};
