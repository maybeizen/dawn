function replaceGuildId(obj, guildID) {
  if (typeof obj === "string") {
    return obj.replace(/{guildID}/g, guildID);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceGuildId(item, guildID));
  }
  if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        replaceGuildId(value, guildID),
      ]),
    );
  }
  return obj;
}

module.exports = replaceGuildId;
