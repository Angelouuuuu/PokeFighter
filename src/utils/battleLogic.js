// src/utils/battleLogic.js
export function compareStats(statsA, statsB, pokemonA, pokemonB) {
  let rounds = [];
  let scoreA = 0;
  let scoreB = 0;
  let decidingStat = '';

  // Compare stats: 'hp', 'attack', 'speed'
  ['hp', 'attack', 'speed'].forEach(stat => {
    const a = statsA[stat] || 0;
    const b = statsB[stat] || 0;

    // Determine the winner for this stat
    const winner = a > b ? pokemonA.name : a < b ? pokemonB.name : 'Tie';

    // Update rounds with this stat's result
    rounds.push({ stat, a, b, winner });

    // Update score based on which stat is higher
    if (a > b) scoreA++;
    else if (b > a) scoreB++;

    // Track the stat that could be the deciding factor
    if (!decidingStat && winner !== 'Tie') {
      decidingStat = stat;
    }
  });

  // Determine the overall winner based on the score
  const overallWinner = scoreA > scoreB ? pokemonA.name : pokemonB.name;

  return {
    winner: overallWinner,
    rounds,
    decidingStat, // Return the stat that made the difference
  };
}
