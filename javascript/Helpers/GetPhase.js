/**
 * Calculates the current phase.
 * @param departureTime
 * @param distance
 * @param averageWalkingSpeed
 * @param now
 * @returns {null}
 */
export function getPhase(departureTime, distance, averageWalkingSpeed = 5000, now = Date.now() / 1000) {
  const fastWalkingSpeed = averageWalkingSpeed * 1.4;
  const slowWalkingSpeed = averageWalkingSpeed * 0.6;

  const slowWalkInHours = distance / slowWalkingSpeed;
  const averageWalkInHours = distance / averageWalkingSpeed;
  const fastWalkInHours = distance / fastWalkingSpeed;

  const timeLeft = departureTime - now;
  const prepareMarge = 60;

  let phase = null;

  if (timeLeft > slowWalkInHours + prepareMarge) {
    // You can wait a little longer.
    phase = 'wait';
  }
  else if (timeLeft > slowWalkInHours) {
    // You should be preparing now, leave in 30 sec.
    phase = 'prepare';
  }
  else if (timeLeft > averageWalkInHours + 30 || timeLeft > fastWalkInHours) {
    // You should be walking or running now.
    phase = 'traveling';
  }
  else if (timeLeft < fastWalkInHours) {
    // You have missed the trip.
    phase = 'missed';
  }

  return phase;
}