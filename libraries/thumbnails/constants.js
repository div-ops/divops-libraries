// NOTE: @see https://brandcolors.net/b/aiesec
const THUMBNAIL_THEME = Object.freeze({
  BLUE_WHITE: { BG_COLOR: "#037EF3", COLOR: "WHITE" },
  BLUE_BLACK: { BG_COLOR: "#037EF3", COLOR: "BLACK" },
  TOMATO_WHITE: { BG_COLOR: "#F85A40", COLOR: "WHITE" },
  TOMATO_BLACK: { BG_COLOR: "#F85A40", COLOR: "BLACK" },
  GREEN_WHITE: { BG_COLOR: "#00C16E", COLOR: "WHITE" },
  GREEN_BLACK: { BG_COLOR: "#00C16E", COLOR: "BLACK" },
  PURPLE_WHITE: { BG_COLOR: "#7552CC", COLOR: "WHITE" },
  PURPLE_BLACK: { BG_COLOR: "#7552CC", COLOR: "BLACK" },
  CYAN_WHITE: { BG_COLOR: "#0CB9C1", COLOR: "WHITE" },
  CYAN_BLACK: { BG_COLOR: "#0CB9C1", COLOR: "BLACK" },
  ORANGE_WHITE: { BG_COLOR: "#F48924", COLOR: "WHITE" },
  ORANGE_BLACK: { BG_COLOR: "#F48924", COLOR: "BLACK" },
  YELLOW_BLACK: { BG_COLOR: "#FFC845", COLOR: "BLACK" },
  DARK_WHITE: { BG_COLOR: "#52565E", COLOR: "WHITE" },
  GRAY_BLACK: { BG_COLOR: "#CACCD1", COLOR: "BLACK" },
  WHITE_BLACK: { BG_COLOR: "#F3F4F7", COLOR: "BLACK" },
});

const FONT_TYPE = Object.freeze({
  WHITE: `./font/NANUM_54_WHITE.fnt`,
  BLACK: `./font/NANUM_54_BLACK.fnt`,
});

const CONTENT_TYPE = Object.freeze({
  PNG: "image/png",
});

const THUMB_DEFAULT = Object.freeze({
  WIDTH: 900,
  HEIGHT: 472.5,
  PADDING: 30,
  THEME: "WHITE_BLACK",
});

const TEXT_MAX_LENGTH = 72;

module.exports = {
  THUMBNAIL_THEME,
  FONT_TYPE,
  CONTENT_TYPE,
  THUMB_DEFAULT,
  TEXT_MAX_LENGTH,
};
