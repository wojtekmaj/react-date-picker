const fs = require('fs');

fs.copyFile('./src/DatePicker.less', 'build/DatePicker.less', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('DatePicker.less copied successfully.');
});

fs.copyFile('./src/DatePicker.css', 'build/DatePicker.css', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('DatePicker.css copied successfully.');
});
