const Jimp = require("jimp");
const { FONT_TYPE } = require("./constants");
const path = require("path");

const Font = {
  storage: {},

  load: async ({ type }) => {
    if (!Object.keys(FONT_TYPE).includes(type)) {
      throw new Error(`Font type is not valid. (${type})`);
    }

    return Jimp.loadFont(path.resolve(__dirname, FONT_TYPE[type]));
  },

  get: async ({ type }) => {
    if (Font.storage[type]) {
      return Font.storage[type];
    }

    const font = await Font.load({ type });

    Font.storage[type] = font;

    return font;
  },
};

module.exports = {
  Font,
};
