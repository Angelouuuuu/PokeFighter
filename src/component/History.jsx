import { useEffect, useState } from 'react';

const BattleHistory = () => {
  const [history, setHistory] = useState([]);

  // Fetch battle history on component mount
  useEffect(() => {
    const fetchBattleHistory = async () => {
      try {
        const response = await fetch('http://localhost:3000/battles');
        const data = await response.json();

        // Group battles by date
        const groupedHistory = groupByDate(data);
        setHistory(groupedHistory);
      } catch (error) {
        console.error('Error fetching battle history:', error);
      }
    };

    fetchBattleHistory();
  }, []);

  // Function to group battles by date
  const groupByDate = (data) => {
    return data.reduce((acc, battle) => {
      const battleDate = new Date(battle.date).toLocaleDateString(); // Format date as MM/DD/YYYY
      if (!acc[battleDate]) acc[battleDate] = [];
      acc[battleDate].push(battle);
      return acc;
    }, {});
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Battle History</h1>

      {Object.keys(history).length === 0 ? (
        <p>No battle history available.</p>
      ) : (
        Object.keys(history).map((date, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">{date}</h2>
            {history[date].map((battle, battleIndex) => (
              <div key={battleIndex} className="bg-gray-700 p-4 rounded-md mb-4">
                <h3 className="font-bold">{battle.overall_winner} won the battle!</h3>
                <ul>
                  {battle.battles.map((round, roundIndex) => (
                    <li key={roundIndex} className="text-left">
                      Round {roundIndex + 1}: {round.user_pokemon} vs {round.opponent_pokemon} - Winner: {round.winner}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default BattleHistory;
