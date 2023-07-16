rm -rf Anya-Session
rm -rf An*on
mkdir Anya-Session
latest_file=$(ls -t creds-*.json 2>/dev/null | head -n1)
if [ -n "$latest_file" ]; then 
  file_extension="${latest_file##*.}"
  new_filename="creds.${file_extension}"
if [ -e "creds.json" ]; then
rm creds.json
fi
mv "$latest_file" creds.json
  echo "🚀 Renamed $latest_file to creds.json because you used wrong filename."
else
  echo "Valid creds.json ✅"
fi
cp -r creds.json Anya-Session
yarn starts
