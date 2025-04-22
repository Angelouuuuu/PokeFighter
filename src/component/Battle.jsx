import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { compareStats } from '../utils/battleLogic';

const Battle = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [userTeam, setUserTeam] = useState([]);
  const [opponentTeam, setOpponentTeam] = useState([]);
  const [userChoices, setUserChoices] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [opponentIndex, setOpponentIndex] = useState(0);
  const [battleLog, setBattleLog] = useState([]);
  const [battleOver, setBattleOver] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    if (state && state.userTeam && state.opponentTeam) {
      setUserTeam(state.userTeam);
      setOpponentTeam(state.opponentTeam);
      setUserChoices([...state.userTeam]);
    } else {
      navigate('/');
    }
  }, [state, navigate]);

  const getStats = (pokemon) => {
    const stats = {};
    pokemon.stats.forEach((s) => {
      if (['hp', 'attack', 'speed'].includes(s.stat.name)) {
        stats[s.stat.name] = s.base_stat;
      }
    });
    return stats;
  };

  const handleBattle = (userPokemon) => {
    const opponentPokemon = opponentTeam[opponentIndex];

    const userStats = getStats(userPokemon);
    const oppStats = getStats(opponentPokemon);

    // Add a logic to compare stats and determine the winning stat
    const { winner, rounds, decidingStat } = compareStats(userStats, oppStats, userPokemon, opponentPokemon);

    const result = {
      user_pokemon: userPokemon.name,
      opponent_pokemon: opponentPokemon.name,
      winner: winner,
      rounds,
      decidingStat, // Track the stat that decided the battle
      user_pokemon_details: userPokemon,
      opponent_pokemon_details: opponentPokemon,
    };

    const newLog = [...battleLog, result];
    setBattleLog(newLog);
    setSelectedPokemon(userPokemon);
    setUserChoices((prev) => prev.filter((p) => p.id !== userPokemon.id));

    if (opponentIndex < 5) {
      setOpponentIndex(opponentIndex + 1);
    } else {
      setBattleOver(true);
      postBattleHistory(newLog);
    }
  };

  const postBattleHistory = async (log) => {
    const userWins = log.filter(r => r.winner === r.user_pokemon).length;
    const opponentWins = log.length - userWins;
    const overallWinner = userWins > opponentWins ? 'User' : 'Opponent';

    const payload = {
      date: new Date().toISOString(),
      user_team: userTeam.map(p => p.name),
      opponent_team: opponentTeam.map(p => p.name),
      battles: log,
      overall_winner: overallWinner
    };

    await fetch('http://localhost:3000/battles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  const restart = () => navigate('/PokeTeam');

  const handleResultClick = (result) => {
    setSelectedResult(result);
  };

  const closeResultDetails = () => {
    setSelectedResult(null);
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Battle Arena</h1>

      {!battleOver && opponentTeam.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="w-1/2 p-4 bg-gray-600 rounded-xl shadow-md m-2">
              <h3 className="text-xl font-semibold capitalize mb-2">
                {opponentTeam[opponentIndex].name}
              </h3>
              <img
                src={opponentTeam[opponentIndex].sprites.front_default}
                alt={opponentTeam[opponentIndex].name}
                className="w-48 h-48 mx-auto mb-4"
              />

            </div>

            <div className="w-1/2 p-4 bg-gray-600 rounded-xl shadow-md m-2">
              <h3 className="text-xl font-semibold capitalize mb-2">
                {selectedPokemon ? selectedPokemon.name : 'Waiting for your choice...'}
              </h3>
              {selectedPokemon ? (
                <>
                  <img
                    src={selectedPokemon.sprites.front_default}
                    alt={selectedPokemon.name}
                    className="w-48 h-48 mx-auto mb-4"
                  />
     
                </>
              ) : (
                <div className="text-gray-500">Loading...</div>
              )}
            </div>
          </div>

          <p>Select your Pokémon for this round:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {userChoices.map((pokemon) => (
              <div
                key={pokemon.id}
                onClick={() => handleBattle(pokemon)}
                className="cursor-pointer bg-white text-black p-4 rounded-xl shadow hover:scale-105 transition"
              >
                <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-24 h-24 mx-auto" />
                <p className="capitalize font-semibold mt-2">{pokemon.name}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {battleOver && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2 text-left text-white">Battle Results</h2>
          {battleLog.map((entry, index) => (
            <div
              key={index}
              onClick={() => handleResultClick(entry)}
              className="bg-gray-100 rounded p-3 mb-2 text-left text-black cursor-pointer"
            >
              <p><strong>Round {index + 1}:</strong> {entry.user_pokemon} vs {entry.opponent_pokemon}</p>
              <p>Winner: <strong>{entry.winner}</strong></p>
            </div>
          ))}

          {selectedResult && (
            <div className="bg-gray-600 p-4 mt-4 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">Round Details</h3>
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">User's Pokémon: {selectedResult.user_pokemon}</h4>
                  <img
                    src={selectedResult.user_pokemon_details.sprites.front_default}
                    alt={selectedResult.user_pokemon}
                    className="w-24 h-24 mb-2"
                  />
                  {selectedResult.user_pokemon_details.stats.map((stat) => (
                    <p
                      key={stat.stat.name}
                      className={`capitalize ${selectedResult.decidingStat === stat.stat.name ? 'text-green-500 font-bold' : ''}`}
                    >
                      <strong>{stat.stat.name}:</strong> {stat.base_stat}
                    </p>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold">Opponent's Pokémon: {selectedResult.opponent_pokemon}</h4>
                  <img
                    src={selectedResult.opponent_pokemon_details.sprites.front_default}
                    alt={selectedResult.opponent_pokemon}
                    className="w-24 h-24 mb-2"
                  />
                  {selectedResult.opponent_pokemon_details.stats.map((stat) => (
                    <p
                      key={stat.stat.name}
                      className={`capitalize ${selectedResult.decidingStat === stat.stat.name ? 'text-red-500 font-bold' : ''}`}
                    >
                      <strong>{stat.stat.name}:</strong> {stat.base_stat}
                    </p>
                  ))}
                </div>
              </div>
              <p className="mt-4">Winner: <strong>{selectedResult.winner}</strong></p>
              <button
                onClick={closeResultDetails}
                className="mt-4 bg-red-600 text-white font-bold py-2 px-6 rounded"
              >
                Close
              </button>
            </div>
          )}

          <button
            onClick={restart}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          >
            Back to Team Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default Battle;
