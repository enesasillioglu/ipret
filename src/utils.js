/**
 * @module utils
 */
var slice = [].slice;

/**
 * String format function with support for both positional and named parameters.
 * Supports:
 *   - Positional: "Hello {0} {1}" with args: "World", "!"
 *   - Named: "Hello {{name}} {{symbol}}" with args: { name: "World", symbol: "!" }
 *   - Mixed: "Floor {0}: {{roomName}}" with args: 5, { roomName: "Kitchen" }
 *
 * @param {String} str   String to be formatted
 * @param {...*}   args  Format params (can be values or object)
 */
exports.stringFormat = function () {
  var args, i, j, ref, reg, s, namedParams;
  args = arguments.length >= 1 ? slice.call(arguments, 0) : [];
  s = args[0];

  if (!s) return s;

  // Extract named parameters object (if last arg is an object)
  var lastArg = args[args.length - 1];
  if (lastArg && typeof lastArg === 'object' && !Array.isArray(lastArg)) {
    namedParams = lastArg;
  }

  // Replace named parameters {{key}}
  if (namedParams) {
    for (var key in namedParams) {
      if (namedParams.hasOwnProperty(key)) {
        // Use double curly braces for named params: {{name}}
        reg = new RegExp('\\{\\{' + key + '\\}\\}', 'gm');
        s = s.replace(reg, namedParams[key]);
      }
    }
  }

  // Replace positional parameters {0}, {1}, etc.
  var positionalArgs = namedParams ? args.length - 1 : args.length;
  for (i = j = 0, ref = positionalArgs - 1; ref >= 0 ? j < ref : j > ref; i = ref >= 0 ? ++j : --j) {
    reg = new RegExp('\\{' + i + '\\}', 'gm');
    s = s.replace(reg, args[i + 1]);
  }

  return s;
};
