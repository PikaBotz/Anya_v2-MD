import {searchArtists, getArtist} from '../src';

test('Search for Dua Lipa and get more data', async () => {
  const query = 'Dua Lipa';

  const results = await searchArtists(query);
  expect(results.length).toBeGreaterThanOrEqual(1);
  const firstResult = results[0]
  expect(firstResult).toBeDefined()
  const data = await getArtist(firstResult.artistId!)
  expect(data).toBeDefined()
  expect(data.suggestedArtists?.length).toBeGreaterThanOrEqual(1)
  expect(data.albums?.length).toBeGreaterThanOrEqual(1)
  expect(data.singles?.length).toBeGreaterThanOrEqual(1)
  console.log(data)
});
