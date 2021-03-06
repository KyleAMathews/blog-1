import moment from 'moment';

export default function shortDate(providedDate, providedNow) {
  const date = moment(providedDate);
  const now = moment(providedNow);

  const currentYear = now.format('YYYY');
  const year = date.format('YYYY');

  if (currentYear === year) {
    return date.format('MMM DD');
  }

  return date.format('YYYY MMM DD');
}
