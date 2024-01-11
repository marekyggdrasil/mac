cd contracts/compile-cache/
if [ ! -d ../../ui/public/cache/ ]; then
    mkdir -p ../../ui/public/cache/
fi
cp `ls | grep -v README.md` ../../ui/public/cache/
cd ../../
cp contracts/compilation_cache_list.json ui/pages/
