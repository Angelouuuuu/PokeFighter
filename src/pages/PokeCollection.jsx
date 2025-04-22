import { useState, useEffect } from "react"
import PokeCards from "../component/PokeCards"

function PokeCollection() {
  const [allPokemon, setAllPokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => res.json())
      .then((data) => {
        const pokemonDetails = data.results.map((pokemon) =>
          fetch(pokemon.url)
            .then((res) => res.json())
            .then((data) => ({
              id: data.id,
              name: data.name,
              image: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
              types: data.types.map((type) => type.type.name),
            }))
        )

        Promise.all(pokemonDetails)
          .then((details) => {
            setAllPokemon(details)
            setLoading(false)
          })
          .catch((err) => {
            setError("Failed to fetch Pokémon details")
            setLoading(false)
            console.error(err)
          })
      })
      .catch((err) => {
        setError("Failed to fetch Pokémon list")
        setLoading(false)
        console.error(err)
      })
  }, [])

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">Pokédex</h1>

      {error ? (
        <div className="text-center text-red-500 my-8">{error}</div>
      ) : (
        <PokeCards pokemons={allPokemon} loading={loading} />
      )}
    </div>
  )
}

export default PokeCollection
