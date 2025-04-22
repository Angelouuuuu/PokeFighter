function HeroSection() {
  const featuredPokemon = [
    {
      id: 25,
      name: "pikachu",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    },
    {
      id: 6,
      name: "charizard",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    },
    {
      id: 150,
      name: "mewtwo",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
    },
  ]

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-yellow-300 via-pink-400 to-blue-400 rounded-xl shadow-xl">
 
      <div className="absolute inset-0 bg-[url('/pokeball-pattern.svg')] opacity-10"></div>

      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-3xl"></div>

      <div className="relative px-4 py-12 sm:px-6 sm:py-16 lg:py-20 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
            PokéFighter
          </h1>

            <p className="max-w-3xl mt-6 text-xl text-white/90">
              Search and discover Pokémon from all generations. Build your dream team and become the unbeatable Pokémon Fighter!
            </p>

            <div className="mt-10">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-filter backdrop-blur-sm border border-white/20 hover:bg-opacity-25 transition-all">
                  <div className="font-bold text-white text-3xl">151+</div>
                  <div className="text-white/90 text-sm font-medium">Pokémon</div>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-filter backdrop-blur-sm border border-white/20 hover:bg-opacity-25 transition-all">
                  <div className="font-bold text-white text-3xl">18</div>
                  <div className="text-white/90 text-sm font-medium">Types</div>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-filter backdrop-blur-sm border border-white/20 hover:bg-opacity-25 transition-all">
                  <div className="font-bold text-white text-3xl">+</div>
                  <div className="text-white/90 text-sm font-medium">Teams</div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex justify-center relative">
            <div className="relative w-full h-64 lg:h-80">
              {featuredPokemon.map((pokemon, index) => (
                <div
                  key={pokemon.id}
                  className={`absolute transition-all duration-500 ${
                    index === 0
                      ? "z-30 scale-100 opacity-100 transform translate-x-0"
                      : index === 1
                      ? "z-20 scale-90 opacity-80 transform translate-x-12"
                      : "z-10 scale-80 opacity-60 transform translate-x-24"
                  }`}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                    <img
                      src={pokemon.image || "/placeholder.svg"}
                      alt={pokemon.name}
                      className="w-56 h-56 object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
