/**
 * This function will capitalize the first Letter
 *
 * @param value
 * @returns
 */
export function capitalize(value: string) {
  // const splitAtSpace = value.
  function capitalizeFirstLetter(str: string) {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }
  return capitalizeFirstLetter(value);
}
