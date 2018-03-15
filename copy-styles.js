const fs = require('fs');

fs.copyFile('src/DatePicker.less', 'dist/DatePicker.less', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('DatePicker.less copied successfully.');
});
