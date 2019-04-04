/**
 * Build / minify the project
 */
module.exports = new Promise((resolve, reject) => {

  const pjson = require('./package.json');
  const fs = require('fs');
  var resolved = 1;

  //Clear out any existing files in dist
  console.log('Clearing out dist/ Directory...');
  fs.readdir('dist', (err, files) => {
    if (err) throw err;
    var numFiles = files.length;
    if(!numFiles){
      return doBuild();
    }
    for (const file of files) {
      fs.unlink('dist/'+file, err => {
        if (err) throw err;
        if(!--numFiles){
          console.log('...dist/ Directory Cleared')
          doBuild();
        }
      });
    }
  });

  function doBuild(){
    console.log('Building distribution files...')

    // I couldn't get @imports working with node-minify so I call the platform directly
    console.log('Minifying CSS...');
    let CleanCSS = require('clean-css');
    new CleanCSS({
      inline: ['all'],
      level: 2
    }).minify(['src/css/t_menu.css'], function(error, output){
      if(output.errors.length){
        console.log(output.errors); // a list of errors raised
      }
      fs.writeFile('dist/t-menu-'+pjson.version+'-min.css', output.styles, function(err) {
        if(err) {
          reject(err);
          return console.log(err);
        }
        console.log('...CSS Minified.')
        if(!(--resolved)){
          resolve();
        }
      });
    });
  }
});
