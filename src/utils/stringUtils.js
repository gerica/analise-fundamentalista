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
      return StringUtils.replaceAll(temp, ',', '');
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

// 60.351.000,00
// console.log(StringUtils.removeCharacters('10,72%', '%'));
// const val = '60.351.000,00%';
// console.log(val);
// console.log(StringUtils.convertToCurrency(StringUtils.removeCharacters(val, '%')));
