const fs = require('fs');

fs.copyFile('src/DatePicker.css', 'dist/DatePicker.css', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('DatePicker.css copied successfully.');
});
