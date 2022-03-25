const postcssPresetEnv = require("postcss-preset-env");

module.exports = {
  parser: require("postcss-scss"),
  plugins: [
    require("postcss-import"),
    require("postcss-nested").default,
    require("tailwindcss"),
    require("postcss-preset-env"),
    require("autoprefixer"),
    // require("cssnano"),
  ],
};

// const fs = require('fs');
// const { name, version, author, cssConfig } = JSON.parse(fs.readFileSync('package.json'));

// const header = `
// @charset "UTF-8";
// /*!
//  * ${name} - ${version}
//  *
//  * Copyright (c) ${new Date().getFullYear()} ${author.name}
//  */
//   `;

// module.exports = (ctx) => {
//   const prefix = ctx.env === 'compat' ? '' : cssConfig.prefix;
//   const devMessage = `🎉🎉🎉🎉 \n${name} ${ctx.env} build was compiled sucessfully! \n`;


//   return {
//     map: ctx.options.map,
//     parser: ctx.options.parser,
//     plugins: {
//       'postcss-import': { root: ctx.file.dirname },
//       'postcss-prefixer': {
//         prefix,
//         ignore: [/\[class\*=.*\]/],
//       },
//       'postcss-preset-env': {
//         autoprefixer: {
//           cascade: false,
//         },
//         features: {
//           'custom-properties': true,
//         },
//       },
//       cssnano: ctx.env === 'production' || ctx.env === 'compat' ? {} : false,
//       'postcss-header': {
//         header,
//       },
//     },
//   };
// };
