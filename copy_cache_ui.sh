cd contracts/compile-cache/
cp `ls | grep -v README.md` ../../ui/public/cache
cp contracts/compilation_cache_list.json ui/pages/
