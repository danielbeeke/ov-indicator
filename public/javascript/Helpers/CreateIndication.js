/**
 * Creates the indication.
 * @param state
 * @param now
 */
export function createIndication(state, now) {
  if (!state.tripSelector.selectedStop) { throw 'Missing selected stop' }
  if (!state.tripSelector.selectedTrip) { throw 'Missing selected trip' }

  const departureTime = state.tripSelector.selectedTrip.ts;
  const distance = state.tripSelector.selectedStop.distance;

  const averageWalkingSpeed = 5000;
  const fastWalkingSpeed = averageWalkingSpeed * 1.4;
  const slowWalkingSpeed = averageWalkingSpeed * 0.6;

  const slowWalkInHours = distance / slowWalkingSpeed;
  const averageWalkInHours = distance / averageWalkingSpeed;
  const fastWalkInHours = distance / fastWalkingSpeed;

  const timeLeft = departureTime - now;
  const prepareMarge = 60;

  let result = {};

  if (timeLeft > slowWalkInHours + prepareMarge) {
    // You can wait a little longer.
    result.phase = 'wait';
  }
  else if (timeLeft > slowWalkInHours) {
    // You should be preparing now, leave in 30 sec.
    result.phase = 'prepare';
  }
  else if (timeLeft > averageWalkInHours + 30 || timeLeft > fastWalkInHours) {
    // You should be walking or running now.
    result.phase = 'traveling';
  }
  else if (timeLeft < fastWalkInHours) {
    // You have missed the trip.
    result.phase = 'missed';
  }

  // These variables may be useful in the template.
  result.timeLeft = timeLeft;
  result.distance = distance;
  result.prepareMarge = prepareMarge;
  result.departureTime = departureTime;
  result.averageWalkingSpeed = averageWalkingSpeed;
  result.leaveTimestamp = departureTime - (averageWalkInHours * 60 * 60);
  result.averageWalkInHours = averageWalkInHours;

  return result;
}