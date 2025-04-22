import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import PokeTeam from "./component/PokeTeam";
import PokeCollection from "./pages/PokeCollection";
import Battle from "./component/Battle";
import BattleHistory from "./component/History";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/poketeam" element={<PokeTeam />} />
            <Route path="/pokecards" element={<PokeCollection />} />
            <Route path="/battlehistory" element={<BattleHistory />} />
            <Route path="/battle" element={<Battle />} />
            {/* Optionally add a 404 fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
