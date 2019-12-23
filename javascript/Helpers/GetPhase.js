/**
 * Calculates the current phase.
 * @param departureTime
 * @param distance
 * @param punctuality
 * @param averageWalkingSpeed
 * @param prepareMinutes
 * @param now
 * @returns string
 */
export function getPhase(
  departureTime,
  distance,
  punctuality,
  averageWalkingSpeed = 5000,
  prepareMinutes = 1,
  now = Date.now() / 1000
) {
  const fastWalkingSpeed = averageWalkingSpeed * 1.4;
  const slowWalkingSpeed = averageWalkingSpeed * 0.6;

  const slowWalkInSeconds = distance / slowWalkingSpeed * 60 * 60;
  const averageWalkInSeconds = distance / averageWalkingSpeed * 60 * 60;
  const fastWalkInSeconds = distance / fastWalkingSpeed * 60 * 60;

  const timeLeft = (departureTime - now) - (prepareMinutes * 60);

  let phase = '';

  if (distance < 50) {
    phase = 'arrived';
  }
  else if (timeLeft > slowWalkInSeconds + (prepareMinutes * 60)) {
    // You can wait a little longer.
    phase = 'wait';
  }
  else if (timeLeft > slowWalkInSeconds) {
    // You should be preparing now, leave in 30 sec.
    phase = 'prepare';
  }
  else if (timeLeft > averageWalkInSeconds + ((slowWalkInSeconds - averageWalkInSeconds) / 2) || timeLeft > fastWalkInSeconds) {
    // You should be walking or running now.
    phase = 'traveling';
  }
  else {
    // You have missed the trip.
    phase = 'missed';
  }

  return phase;
}