/**
 * @title ipret
 * @overview Micro i18n library for node and browser. Translate your app with strings already there.
 * @copyright (c) 2017
 * @license MIT
 * @author İsmail Demirbilek
 * @module ipret
 */
const utils = require('./utils');

var activeLang, translations;
var slice = [].slice;

translations = {};
activeLang = null;

/**
 * Sets translations for a specific language.
 * @param {string} lang Language code, e.g. 'tr' or 'en'.
 * @param {Object} str  {'string': 'translation'} translation pairs.
 */
exports.setStrings = function (lang, str) {
  translations[lang] = str;
  if (Object.keys(translations).length === 1) {
    activeLang = lang;
  }
};

/**
 * Updates active language.
 * @param {string} lang Language code, e.g. 'tr' or 'en'.
 */
exports.setLanguage = function (lang) {
  if (translations[lang] == null) {
    throw new Error('There is no translations map for given language code: ' + lang);
  }
  activeLang = lang;
};

/**
 * Translates a string to active language.
 * support both positional and named parameters.
 *
 * Usage examples:
 *   translate('Hello {0}', 'World')                    // Positional
 *   translate('Hello {{name}}', { name: 'World' })     // Named
 *   translate('Floor {0}: {{room}}', 5, { room: 'Kitchen' }) // Mixed
 *
 * @param  {String} string String to be translated.
 * @param  {...*}   args   Positional or named parameters
 * @return {String}        Translated output.
 */
exports.translate = function () {
  var args, key, translated;
  args = arguments.length >= 1 ? slice.call(arguments, 0) : [];

  if (args.length === 0) return '';

  key = args[0];

  // Get translation (or use key if not found)
  translated = (translations[activeLang] && translations[activeLang][key]) || key;

  // If we have parameters, format the string
  if (args.length > 1) {
    // Translate string arguments before formatting
    var translatedArgs = args.slice(1).map(function (arg) {
      // Only translate string arguments, not objects or other types
      if (typeof arg === 'string' && translations[activeLang] && translations[activeLang][arg]) {
        return translations[activeLang][arg];
      }
      return arg;
    });

    var formatArgs = [translated].concat(translatedArgs);
    return utils.stringFormat.apply(this, formatArgs);
  }

  return translated;
};

/**
 * Active language code.
 * @return {String} Active language.
 */
exports.getLanguage = function () {
  return activeLang;
};

/**
 * All languages.
 * @return {Array} Language keys
 */
exports.getLanguages = function () {
  return Object.keys(translations);
};
