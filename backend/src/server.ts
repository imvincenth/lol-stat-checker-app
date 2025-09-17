import express from "express";
import cors from 'cors';
import playerRoutes from "./routes/player";
import matchRoutes from "./routes/matches";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString(), apiKey: !!process.env.RIOT_API_KEY });
});

// Player route
app.use('/api/summoner', playerRoutes);
// Match route
app.use('/api/matches', matchRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  console.log(`Riot API Key is configured: ${!!process.env.RIOT_API_KEY}`);
});