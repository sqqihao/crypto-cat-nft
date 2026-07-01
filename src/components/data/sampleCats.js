// 12 只示例猫的 DNA 集合（链上没猫时首页展示）
// DNA 10 字符 packed string（每位 0-9）：
//   顺序 [eyesShape, foreheadShape, animation, headColor, pawsColor, decorationColor, eyesColor, mouthColor, backgroundColor, collarColor]
//   范围：1-6（所有属性覆盖）

export const SAMPLE_CATS = [
  // 1-3: cyberpunk 风格（强对比、亮色眼睛）
  { id: 1, name: '霓虹喵', dna: '2234521124' },   // 眼睛 chill 2 + 强动画 3 + 亮色 4
  { id: 2, name: '赛博虎', dna: '1453224531' },   // 眼睛 cyclope 4 + 头顶 1 + 装饰 4
  { id: 3, name: '电光猫', dna: '4641235652' },   // 眼睛 asean 5 + 动画 6 + 高对比 5

  // 4-6: 现代/柔和（中间值、慢动画）
  { id: 4, name: '紫水晶', dna: '3121432143' },   // 眼睛 basic 1 + 中动画 2 + 紫色 3
  { id: 5, name: '月兔猫', dna: '1232543312' },   // 眼睛 chill 2 + 慢动画 1 + 白色 1
  { id: 6, name: '粉樱', dna: '2142241423' },   // 眼睛 tired 3 + 头像 1 + 粉色 4

  // 7-9: 卡通/可爱（圆眼睛、头部大）
  { id: 7, name: '星空', dna: '4361452244' },   // 眼睛 basic 1 + 头像 4 + 装饰 4
  { id: 8, name: '暗夜', dna: '5512334535' },   // 眼睛 cyclope 4 + 头像 5 + 黑色 5
  { id: 9, name: '向阳', dna: '3421412333' },   // 眼睛 chill 2 + 头像 4 + 灰色 3

  // 10-12: 极端造型（覆盖全 1-6 范围）
  { id: 10, name: '幽灵', dna: '1661666665' },  // 眼睛 surprised 6 + 动画 6 + 纯白
  { id: 11, name: '火焰', dna: '1111111111' },  // 全 1（最简）
  { id: 12, name: '彩虹', dna: '6666666666' },  // 全 6（最复杂）
];
