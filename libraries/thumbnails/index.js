const {
  THUMBNAIL_THEME,
  CONTENT_TYPE,
  THUMB_DEFAULT,
  TEXT_MAX_LENGTH,
} = require("./constants");
const { Font } = require("./font");
const Jimp = require("jimp");

const Center = {
  alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
};

const self = {
  // NOTE: 썸네일 테마 이름
  THEME: Object.keys(THUMBNAIL_THEME),

  // NOTE: JIMP의 이미지 생성
  createImage: async (width, height, color) => {
    return new Promise((resolve, reject) => {
      new Jimp(width, height, color, (err, image) => {
        if (err != null) {
          return reject(err);
        }
        return resolve(image);
      });
    });
  },

  // NOTE: JIMP의 image => png buffer
  bufferToPng: async (image) => {
    return new Promise((resolve, reject) => {
      image.getBuffer(Jimp.MIME_PNG, (err, data) => {
        if (err != null) {
          return reject(err);
        }
        return resolve({
          data,
          contentType: CONTENT_TYPE.PNG,
        });
      });
    });
  },

  // NOTE: 썸네일 생성
  generateThumbnail: async ({
    width = THUMB_DEFAULT.WIDTH,
    height = THUMB_DEFAULT.HEIGHT,
    padding = THUMB_DEFAULT.PADDING,
    text,
    theme,
  } = {}) => {
    if (theme == null) {
      const themeKeys = Object.keys(THUMBNAIL_THEME);
      theme = Object.keys(THUMBNAIL_THEME)[text.length % themeKeys.length];
    }

    if (!THUMBNAIL_THEME[theme]) {
      throw new Error(`theme is not valid. (${theme})`);
    }

    if (text == null) {
      throw new Error(`text is not valid. (${text})`);
    }

    text = text.slice(0, TEXT_MAX_LENGTH);
    const [x, y] = [padding / 2, padding / 2];
    const max = { width: width - padding, height: height - padding };
    const [font, image] = await Promise.all([
      Font.get({ type: THUMBNAIL_THEME[theme].COLOR }),
      self.createImage(width, height, THUMBNAIL_THEME[theme].BG_COLOR),
    ]);

    image.print(font, x, y, { text, ...Center }, max.width, max.height);

    return await self.bufferToPng(image);
  },
};

module.exports = {
  Thumb: self,
};
