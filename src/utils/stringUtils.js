class StringUtils {
  static configureTopic(topic) {
    if (topic) {
      return topic.replaceAll('/', '.');
    }
    return null;
  }

  static removeCharacters(string, character) {
    if (string) {
      return string.replaceAll(character, '');
    }
    return null;
  }

  static convertToCurrency(string) {
    if (string) {
      return string.replaceAll('.', '').replaceAll(',', '.');
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
}

export default StringUtils;
