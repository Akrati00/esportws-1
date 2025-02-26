// MatchesPage.jsx
import { createSignal, createEffect, For } from 'solid-js';
import { BsWifi2 } from 'solid-icons/bs'

const MatchesPage = () => {
  const [matches, setMatches] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  createEffect(() => {
    setLoading(true);
    fetch('https://api.opendota.com/api/publicMatches')
      .then(response => response.json())
      .then(data => {
        const fetchedMatches = data.slice(0, 50).map(match => ({
          id: match.match_id,
          radiantWin: match.radiant_win,
          duration: formatDuration(match.duration),
          avgMmr: match.avg_mmr != null ? Math.round(match.avg_mmr) : 'Unknown',
          gameMode: match.game_mode
        }));
        setMatches(fetchedMatches);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching matches:', error);
        setLoading(false);
      });
  });

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const SkeletonCard = () => (
    <div class="bg-gray-800 rounded-lg shadow-md p-4 w-full animate-pulse m-2">
      <div class="flex justify-between items-center">
        <div class="h-6 bg-gray-700 rounded w-1/4"></div>
        <div class="h-6 bg-gray-700 rounded w-1/4"></div>
      </div>
      <div class="mt-2 h-4 bg-gray-700 rounded w-1/2"></div>
    </div>
  );

  return (
    <div class="container mx-auto px-4 py-8 bg-gray-900">
      <h1 class="text-3xl font-bold mb-6 text-white">Live Matches</h1>
      <div class="grid gap-4 md:grid-cols-2">
        <For each={loading() ? Array(20).fill(null) : matches()}>
          {(match, index) => (
            loading() ? (
              <SkeletonCard />
            ) : (
              <div class="bg-gray-800 rounded-lg shadow-md p-4 m-2 border border-gray-700">
                <div class="flex justify-between items-center">
                  <div class="text-red-700 font-bold animate-pulse "><span class='text-xl m-1 rounded-full'><BsWifi2 class=' inline-block'/></span>LIVE</div>
                  <div class="text-gray-400 text-sm">ID: {match.id}</div>
                </div>
                <div class="mt-2 flex justify-between items-center">
                  <div class="text-white font-bold">
                    {match.radiantWin ? 'Radiant' : 'Dire'} Win
                  </div>
                  <div class="text-gray-400 text-sm">{match.duration}</div>
                </div>
                <div class="mt-2 flex justify-between items-center text-sm text-gray-400">
                <div>Avg MMR: {match.avgMmr !== 'Unknown' ? match.avgMmr : 'Unknown'}</div>
                <div>Mode: {match.gameMode}</div>
              </div>
              </div>
            )
          )}
        </For>
      </div>
    </div>
  );
};

export default MatchesPage;