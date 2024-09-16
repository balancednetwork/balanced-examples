# How to query a pool on Balanced Network

This guide will show you how to query a pool on Balanced Network.

In order to execute the swap we need the pool id for the pool you want to query. In this example we will use the sicx/bnusd pool with pool id `0x2`.

The source code for the script can be found [here](../scripts/query-pool-price.js).
## Query a pool

To query a pool you can use one of the following methods availables in the DEX contract of Balanced Network.

* `getPoolStats(int poolId)`: Returns the pool stats for the pool with the given pool id.
* `getPoolStatsForPair(address _base, address _quote)`: Returns the pool stats for the pool with the given base and quote tokens.


Example of calling the `getPoolStats` method for the pool with pool id `0x2`:

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"icx_call","id":604,"params":{"to":"cxa0af3165c08318e988cb30993b3048335b94af6c","dataType":"call","data":{"method":"getPoolStats", "params": {"_id": "0x2"}}}}' https://api.icon.community/api/v3
```

Response
```bash
{
  "jsonrpc": "2.0",
  "result": {
    "base": "0x5448adac2361f47bae0d8",
    "base_decimals": "0x12",
    "base_token": "cx2609b924e33ef00b648a409245c7ea394c467824",
    "min_quote": "0x8ac7230489e80000",
    "name": "sICX/bnUSD",
    "price": "0x22be6fb1ead837e",
    "quote": "0xd302893902d06825e407",
    "quote_decimals": "0x12",
    "quote_token": "cx88fd7df7ddff82f7cc735c871dc519838cb235bb",
    "total_supply": "0x1b153dd01fa3ba3177e09"
  },
  "id": 604
}
```
