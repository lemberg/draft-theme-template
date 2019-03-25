const path = require('path');
const glob = require('glob');

class CollectIgnoredWebpackHelper {
  /**
   * Collect array of strings to be ignored for preventing webpack creating dummy
   * js files for each entry point
   * @param {string} wildCard wildcard for global mapping
   * @param {string} excludedWildCard to be ignored during mapping, default ''
   * @param {string[]} preDefinedList manually provided list
   * @param {string} entryPointExt extention of the entry point
   * @return string[]
   */

  static ignored(
    wildCard,
    excludedWildCard = '',
    preDefinedList = [],
    entryPointExt = '.scss',
  ) {
    const ignoredList = preDefinedList;
    const globOptions = excludedWildCard ? { ignored: excludedWildCard } : {};

    const files = glob.sync(wildCard, globOptions);

    files.forEach(file => {
      const extensionName = path.extname(file);

      if (extensionName === entryPointExt) {
        const fileNameIgnored = path
          .basename(file)
          .replace(new RegExp(entryPointExt), '.js');

        ignoredList.push(fileNameIgnored);
      }
    });

    return ignoredList;
  }
}

module.exports = CollectIgnoredWebpackHelper;
