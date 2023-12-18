const fs = require('fs');
const path = require('path');

const directoryPath = 'lib/plugins'; // Your plugins directory

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    if (path.extname(filePath) === '.js') {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }

        const modifiedData = data.replace(/"(\w+)":/g, '$1:');

        fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
          if (err) {
            console.error('Error writing to file:', err);
            return;
          }
          console.log(`File '${file}' has been modified.`);
        });
      });
    }
  });
});
