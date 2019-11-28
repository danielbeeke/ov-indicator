/**
 * Returns a relative time string.
 * @param epoch
 * @param addPrefixOrSuffix
 * @param style
 * @param now
 * @param langCode
 * @returns {string}
 */
export let relativeTime = (epoch, addPrefixOrSuffix = true, style = 'long', now = Date.now() / 1000, langCode = 'nl') => {
  const lf = new Intl.ListFormat(langCode, { style: 'long', type: 'conjunction' });
  const rtf = new Intl.RelativeTimeFormat(langCode, {
    localeMatcher: "best fit",
    numeric: "auto",
    style: style,
  });

  const cleaner = (string) => string.replace('over ', '').replace(' geleden', '').replace('+', '').trim();
  const pastOrFuture = epoch > now ? 'future' : 'past';

  const totalSeconds = Math.abs(epoch - now);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor((totalSeconds % 3600) % 60);

  let timeParts = [];
  if (hours) timeParts.push(cleaner(rtf.format(hours, 'hour')));
  if (minutes) timeParts.push(cleaner(rtf.format(minutes, 'minutes')));

  if (style !== 'short') {
    if (seconds) timeParts.push(cleaner(rtf.format(seconds, 'seconds')));
  }

  let output = lf.format(timeParts);
  if (pastOrFuture === 'future' && addPrefixOrSuffix && output) output = 'Over ' + output;
  if (pastOrFuture === 'past' && addPrefixOrSuffix && output) output = output + ' geleden';

  if (!output) { output = 'nu' }

  return output;
};
