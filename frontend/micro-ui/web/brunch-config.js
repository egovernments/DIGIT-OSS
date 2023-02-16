exports.files = {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'App.js': /^app/
      }
    },
    stylesheets: {joinTo: 'app.css'}
  };
  
  exports.plugins = {
    babel: {presets: ['latest', 'react']},
    postcss: {processors: [require('autoprefixer')]}
  };