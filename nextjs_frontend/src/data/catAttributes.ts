import { getAnimBadge, getBgBadge, getEyesBadge, getShapeBadge } from "@/utils/getBadge";

const COLOR_RANGE = { min: "10", max: "98" };
const SHAPE_RANGE_5 = { min: "1", max: "5" };
const SHAPE_RANGE_6 = { min: "1", max: "6" };

export const colorAttributes = [
  { colorName: "headColor", name: "头部和身体颜色", range: COLOR_RANGE },
  { colorName: "mouthColor", name: "嘴巴颜色", range: COLOR_RANGE },
  { colorName: "pawsColor", name: "爪子尾巴颜色", range: COLOR_RANGE },
  { colorName: "eyesColor", name: "眼睛颜色", range: COLOR_RANGE },
  { colorName: "collarColor", name: "项圈颜色", range: COLOR_RANGE },
];

export const catAttributes = [
  { colorName: "eyesShape", name: "眼神类型", range: SHAPE_RANGE_6, badge: getEyesBadge },
  { colorName: "foreheadShape", name: "前额类型", range: SHAPE_RANGE_5, badge: getShapeBadge },
  { colorName: "decorationColor", name: "前额颜色", range: COLOR_RANGE },
  { colorName: "animation", name: "动作", range: SHAPE_RANGE_6, badge: getAnimBadge },
  { colorName: "backgroundColor", name: "背景色", range: SHAPE_RANGE_5, badge: getBgBadge },
];
