import * as fs from 'fs';

import { Cache } from 'o1js';

const { Mac } = await import('../build/Mac.js');

type CompilationCacheJSONList = {
  files: string[];
};

const cache_directory = 'compile-cache';
const comilation_cache_list_json = 'compilation_cache_list.json';

console.time();
console.log('starting to compile');

const cache: Cache = Cache.FileSystem(cache_directory);
const { verificationKey } = await Mac.compile({ cache });

console.timeEnd();
console.log('compilation done');

let cache_object: CompilationCacheJSONList = {
  files: [],
};

fs.readdirSync(cache_directory).forEach((file_name: string) => {
  if (!file_name.endsWith('.header')) {
    cache_object['files'].push(file_name);
  }
});

// console.log(cache_object);

fs.writeFile(
  comilation_cache_list_json,
  JSON.stringify(cache_object),
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('successfully saved the cached objects list as JSON');
    }
  }
);
