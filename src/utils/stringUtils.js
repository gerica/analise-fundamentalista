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

  static getData() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }
}

export default StringUtils;
