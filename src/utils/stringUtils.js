class StringUtils {
  static removeCharacters(string, character) {
    if (string) {
      return StringUtils.replaceAll(string, character, '');
    }
    return null;
  }

  static convertToCurrency(string) {
    if (string) {
      const temp = StringUtils.replaceAll(string, '.', '');
      return StringUtils.replaceAll(temp, ',', '.');
    }
    return null;
  }

  static getDataInicioDia(dataRef) {
    let date;
    if (dataRef) {
      date = new Date(dataRef);
    } else {
      date = new Date();
    }
    date.setHours(0, 0, 0, 0);
    return date;
  }

  static getDataFinalDiaDia(dataRef) {
    let date;
    if (dataRef) {
      date = new Date(dataRef);
    } else {
      date = new Date();
    }
    date.setUTCHours(23, 59, 59, 999);
    return date;
  }

  static escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  static replaceAll(str, match, replacement) {
    return str.replace(new RegExp(StringUtils.escapeRegExp(match), 'g'), () => replacement);
  }
}

export default StringUtils;

// const val1 = '1.083.050.000,00';
// const val2 = '-0,40%';
// const val3 = '28,98%';
// const val4 = '-362,66%';
// console.log('------------ inicio');
// console.log(val1);
// console.log(val2);
// console.log(val3);
// console.log(val4);
// console.log('------------ antes');
// console.log(StringUtils.convertToCurrency(StringUtils.removeCharacters(val1, '%')));
// console.log(StringUtils.convertToCurrency(StringUtils.removeCharacters(val2, '%')));
// console.log(StringUtils.convertToCurrency(StringUtils.removeCharacters(val3, '%')));
// console.log(StringUtils.convertToCurrency(StringUtils.removeCharacters(val4, '%')));
// console.log('------------ final');
