## promise-coalesce

Coalesces multiple promises for the same identifier into a single request.

Reduces load on downstream systems when requests occur at the same time,
without dropping requests or needing exclusion locks or wait-and-retry attempts.

## Install

With npm:

```sh
npm install promise-coalesce
```

With yarn:

```sh
yarn add promise-coalesce
```

## Usage

```ts
import { coalesceAsync } from 'promise-coalesce';

await coalesceAsync('some-group-key', async () => {
  /* your logic */
});
```

## Example

**Cache Miss Relief Buffer**

```ts
import { coalesceAsync } from 'promise-coalesce';

// Imagine you want to retrieve a value, and you have a cache to speed things up.
// If the value isn't in the cache, you'll need to get it from the source system,
// which can be a time-consuming process like a database query or an API request.
async function getValue(cacheKey: string): Promise<YourData> {
  // When multiple requests try to fetch the same value from the cache at the same time,
  // because of the way async operations work, yielding the event loop at each `await`,
  // then they will all try to get it from the cache.
  let cachedValue = await cache.get(cacheKey);
  // They will take turns checking the condition and all see that the value is missing.
  if (!cachedValue) {
    // Here's where `coalesceAsync` comes to the rescue!
    // Instead of making multiple expensive calls to the source system,
    // we use `coalesceAsync`` to ensure it's called only once, and other requests
    // wanting the same cache key wait for the result.
    cachedValue = await coalesceAsync<YourData>(cacheKey, async () => {
      // Now, we fetch the value from the source system.
      const sourceValue = await getSourceValue();
      // We also cache it for future use.
      await cache.set(cacheKey, sourceValue, ttl);
      // Now, the value is in the cache, and future requests will avoid calling the source system
      // until the cached data expires (based on TTL).
      return sourceValue;
    });
  }
  return cachedValue;
}
```

## Credits

This solution is inspired by [node-cache-manager](https://github.com/node-cache-manager/node-cache-manager)'s
[CallbackFiller](https://github.com/node-cache-manager/node-cache-manager/blob/4.1.0/lib/callback_filler.js) from the `v4.x` line.

It was [removed](https://github.com/node-cache-manager/node-cache-manager/issues/417)
in the `v5.x` line, and `promise-coalesce` is an attempt to recover that feature
while also being generic enough for other applications.
