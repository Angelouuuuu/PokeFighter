import { useState, useEffect } from "react";
import SearchBar from "../component/Search";
import PokeCards from "../component/PokeCards";
import HeroSection from "../component/Hero";

// Fisher-Yates Shuffle Algorithm
const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap
  }
  return shuffledArray;
};

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all Pokémon data
  useEffect(() => {
    setLoading(true);
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => res.json())
      .then((data) => {
        const pokemonDetails = data.results.map((pokemon) =>
          fetch(pokemon.url)
            .then((res) => res.json())
            .then((data) => ({
              id: data.id,
              name: data.name,
              image:
                data.sprites.other["official-artwork"].front_default ||
                data.sprites.front_default,
              types: data.types.map((type) => type.type.name),
              stats: {
                hp: data.stats.find((stat) => stat.stat.name === "hp")?.base_stat || 0,
                attack: data.stats.find((stat) => stat.stat.name === "attack")?.base_stat || 0,
                speed: data.stats.find((stat) => stat.stat.name === "speed")?.base_stat || 0,
              },
            }))
        );

        Promise.all(pokemonDetails)
          .then((details) => {
            const shuffledDetails = shuffleArray(details);
            setAllPokemon(shuffledDetails);
            setFilteredPokemon(shuffledDetails.slice(0, 6));
            setLoading(false);
          })
          .catch((err) => {
            setError("Failed to fetch Pokémon details");
            setLoading(false);
            console.error(err);
          });
      })
      .catch((err) => {
        setError("Failed to fetch Pokémon list");
        setLoading(false);
        console.error(err);
      });
  }, []);

  // Search filtering
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPokemon(allPokemon.slice(0, 6));
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allPokemon.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(query) ||
        pokemon.types.some((type) => type.toLowerCase().includes(query))
    );

    setFilteredPokemon(filtered);
  }, [searchQuery, allPokemon]);

  // 🔥 This was missing
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto">
      <HeroSection pokemons={filteredPokemon} />

      <div className="my-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {error ? (
        <div className="text-center text-red-500 my-8">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      ) : filteredPokemon.length === 0 && !loading ? (
        <div className="text-center text-gray-500 my-8">No Pokémon found.</div>
      ) : (
        <PokeCards pokemons={filteredPokemon} loading={loading} />
      )}
    </div>
  );
}

export default Home;
