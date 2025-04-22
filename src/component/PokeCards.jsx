import { useState } from "react";

function PokeCards({ pokemons, loading }) {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [description, setDescription] = useState("");

  const handleCardClick = async (pokemon) => {
    setSelectedPokemon(pokemon);
    try {
      // Fetch the species (description)
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`);
      const speciesData = await speciesRes.json();
      const flavorEntry = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );
      setDescription(flavorEntry ? flavorEntry.flavor_text.replace(/\f/g, " ") : "No description available.");
  
      // Fetch the detailed Pokémon stats
      const detailsRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`);
      const detailsData = await detailsRes.json();
  
      // Add the stats to the selectedPokemon object
      setSelectedPokemon((prevState) => ({
        ...prevState,
        stats: {
          hp: detailsData.stats.find((stat) => stat.stat.name === "hp")?.base_stat || 0,
          attack: detailsData.stats.find((stat) => stat.stat.name === "attack")?.base_stat || 0,
          speed: detailsData.stats.find((stat) => stat.stat.name === "speed")?.base_stat || 0,
        },
      }));
    } catch (err) {
      console.error("Failed to fetch description or stats:", err);
      setDescription("No description available.");
    }
  };
  

  const handleCloseModal = () => {
    setSelectedPokemon(null);
    setDescription("");
  };

  if (loading) {
    return <div className="text-center my-8 text-lg font-semibold text-gray-700">Loading Pokémon...</div>;
  }

  return (
    <div className="relative">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            onClick={() => handleCardClick(pokemon)}
            className="bg-white rounded-lg shadow-lg p-4 text-center cursor-pointer hover:scale-105 transform transition duration-300"
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-24 h-24 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold capitalize text-black">{pokemon.name}</h3>

            <div className="flex justify-center gap-2 mt-2">
              {pokemon.types.map((type, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-500 px-2 py-1 rounded-full capitalize"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPokemon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>

            <img
              src={selectedPokemon.image}
              alt={selectedPokemon.name}
              className="w-32 h-32 mx-auto mb-4"
            />

            <h2 className="text-2xl font-bold capitalize text-center mb-2">{selectedPokemon.name}</h2>

            <div className="flex justify-center gap-2 mb-4">
              {selectedPokemon.types?.map((type, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-500 px-2 py-1 rounded-full capitalize"
                >
                  {type}
                </span>
              ))}
            </div>

            <p className="text-gray-700 text-sm mb-4 text-center">{description}</p>

            <div className="space-y-1 text-gray-700 text-sm">
              <div><strong>HP:</strong> {selectedPokemon.stats?.hp ?? "N/A"}</div>
              <div><strong>Attack:</strong> {selectedPokemon.stats?.attack ?? "N/A"}</div>
              <div><strong>Speed:</strong> {selectedPokemon.stats?.speed ?? "N/A"}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PokeCards;
