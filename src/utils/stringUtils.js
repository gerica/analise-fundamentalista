class StringUtils {
  static configureTopic(topic) {
    if (topic) {
      return topic.replaceAll('/', '.');
    }
    return null;
  }
}

export default StringUtils;
