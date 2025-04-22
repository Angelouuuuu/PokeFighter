import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PokeTeam() {
  const [team, setTeam] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const pokemonsPerPage = 10;
  const API = 'http://localhost:3000'; // JSON server API endpoint
  const navigate = useNavigate();

  // Fetch saved team and available Pokémon
  useEffect(() => {
    async function fetchTeamAndPokemons() {
      // Fetch team from json-server
      const resTeam = await fetch(`${API}/team`);
      const teamData = await resTeam.json();
      setTeam(teamData);

      // Fetch available Pokémon
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await res.json();

      const fullData = await Promise.all(
        data.results.map(async (p) => {
          const res = await fetch(p.url);
          return await res.json();
        })
      );

      setPokemons(fullData);
    }

    fetchTeamAndPokemons();
  }, []);

  // Add Pokémon to team
  const addToTeam = async (pokemon) => {
    if (team.length < 6) {
      if (!team.find((p) => p.id === pokemon.id)) {
        const res = await fetch(`${API}/team`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pokemon),
        });
        const savedPokemon = await res.json();
        setTeam([...team, savedPokemon]); // Update local state
      } else {
        alert(`${pokemon.name} is already in your team!`);
      }
    } else {
      alert("Your team is already full!");
    }
    setSelectedPokemon(null); // close modal after adding
  };

  // Remove Pokémon from team
  const removeFromTeam = async (id) => {
    await fetch(`${API}/team/${id}`, { method: 'DELETE' }); // DELETE request to remove Pokémon
    setTeam(team.filter((pokemon) => pokemon.id !== id)); // Update local state to remove from team
    setSelectedPokemon(null); // close modal after removing
  };

  // Get random opponent Pokémon team
  const getRandomPokemons = async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const data = await res.json();
    const shuffled = data.results.sort(() => 0.5 - Math.random()).slice(0, 6);
  
    const fullData = await Promise.all(
      shuffled.map(async (p) => {
        const res = await fetch(p.url);
        return await res.json();
      })
    );
  
    return fullData;
  };
  
  const startBattle = async () => {
    if (team.length === 6) {
      const opponentTeam = await getRandomPokemons();
      navigate('/battle', { state: { userTeam: team, opponentTeam } });
    } else {
      alert('Please select 6 Pokémon for your team!');
    }
  };

  // Pagination logic
  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = pokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);
  const totalPages = Math.ceil(pokemons.length / pokemonsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Function to render Pokémon types
  const renderTypes = (types) => {
    return types.map((type) => (
      <span key={type.type.name} className="text-sm bg-gray-300 text-black rounded-full px-3 py-1 m-1">
        {type.type.name}
      </span>
    ));
  };

  return (
    <div className="p-4 relative">
      <h1 className="text-3xl font-bold mb-6 text-center">My Pokémon Team</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {team.map((pokemon) => (
          <div
            key={pokemon.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-black cursor-pointer transition-all hover:scale-105"
            onClick={() => setSelectedPokemon(pokemon)}
          >
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-32 h-32" />
            <h2 className="text-xl font-bold capitalize">{pokemon.name}</h2>
            <div className="mt-2">{renderTypes(pokemon.types)}</div>
          </div>
        ))}
      </div>

      {/* Available Pokémon */}
      <h2 className="text-xl font-bold mb-4 mt-8">Available Pokémon</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentPokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-black cursor-pointer transition-all hover:scale-105"
            onClick={() => setSelectedPokemon(pokemon)}
          >
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-32 h-32" />
            <h3 className="text-lg font-semibold capitalize">{pokemon.name}</h3>
            <div className="mt-2">{renderTypes(pokemon.types)}</div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-bold text-lg">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <button
        onClick={startBattle}
        className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded block mx-auto"
      >
        Let's Battle!
      </button>

      {/* Modal */}
      {selectedPokemon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-4xl relative flex flex-col md:flex-row gap-6">
            <button
              onClick={() => setSelectedPokemon(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black font-bold text-2xl"
            >
              ×
            </button>

            {/* Left Side - Image */}
            <div className="flex-shrink-0 flex justify-center items-center">
              <img
                src={selectedPokemon.sprites.front_default}
                alt={selectedPokemon.name}
                className="w-48 h-48 md:w-64 md:h-64 object-contain"
              />
            </div>

            {/* Right Side - Details */}
            <div className="flex flex-col justify-center text-left text-black">
              <h2 className="text-3xl font-bold capitalize mb-2">{selectedPokemon.name}</h2>

              {/* Description (fake placeholder for now) */}
              <p className="text-sm italic mb-4">
                This is a cool Pokémon ready for battle! (you can replace this with real description later)
              </p>

              {/* Stats */}
              <div className="space-y-1">
                {selectedPokemon.stats.map((stat) => (
                  <p key={stat.stat.name}>
                    <span className="capitalize font-semibold">{stat.stat.name}:</span> {stat.base_stat}
                  </p>
                ))}
              </div>

              {/* Types */}
              <div className="mt-4">
                <h3 className="font-semibold">Types:</h3>
                <div className="flex flex-wrap gap-2">
                  {renderTypes(selectedPokemon.types)}
                </div>
              </div>

              {/* Add or Remove Button */}
              {team.find((p) => p.id === selectedPokemon.id) ? (
                <button
                  onClick={() => removeFromTeam(selectedPokemon.id)}
                  className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded"
                >
                  Remove from Team
                </button>
              ) : (
                <button
                  onClick={() => addToTeam(selectedPokemon)}
                  className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
                >
                  Add to Team
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PokeTeam;
