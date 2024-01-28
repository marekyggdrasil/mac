# MAC!

I am MAC!, or Mina Arbitrated Contracts if you want to be formal. I am an [zkApp](https://docs.minaprotocol.com/zkapps/how-zkapps-work) that makes zkApps (yes, really!).

The best part is you do not even need to know how to code! Go visit https://mac.sqrtxx.com/ to read more about me and try me!

## Setup

Install the dependencies for the smart contract, from the root of this repo run

```sh
cd contracts
```

then install the dependencies

```sh
npm install
```

and build it

```sh
npm run build
```

generate the cache

```sh
npx tsx scripts/gencompilecache.ts
```

( re-run it few times to see how the compile time improves with the cache )

and copy the cache to speed-up the compilation in the UI

```sh
cd ../
sh copy_cache_ui.sh
```

now to prepare the UI of the MAC! app, from same directory run

```sh
cd ui
```

to change the UI directory, now install the dependencies

```sh
npm install
```

and run the app locally

```sh
npm run dev
```

## Running the build

```sh
cd ui/
npm run build
npm run export
```

## Testing the network

If you notice problems connecting to the network via the frontend you can double check possibility to connect via command line as follows

```sh
npx tsx contracts/scripts/networkcheck.ts 
```

example output

```
testing https://proxy.testworld.minaexplorer.com/graphql
successfully set active instance
failed to fetch last block

testing https://proxy.berkeley.minaexplorer.com/graphql
successfully set active instance
blockchain length 37605
```
