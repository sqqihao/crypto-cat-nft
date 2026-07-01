// 12 只静态示例猫的 DNA 集合（链上没猫时首页展示）
// 每个 DNA 是 10 个数字：foreheadShape, eyesShape, animation, headColor, pawsColor, decorationColor, eyesColor, mouthColor, backgroundColor, collarColor
// 覆盖 DNA 1-6 全范围（DNA 0/7+ 走 fallback basic 样式）
export const SAMPLE_CATS = [
  { id: 1, name: '霓虹喵', dna: { foreheadShape: 2, eyesShape: 1, animation: 3, headColor: 2, pawsColor: 4, decorationColor: 5, eyesColor: 1, mouthColor: 1, backgroundColor: 4, collarColor: 5 } },
  { id: 2, name: '紫水晶', dna: { foreheadShape: 3, eyesShape: 2, animation: 1, headColor: 5, pawsColor: 3, decorationColor: 2, eyesColor: 2, mouthColor: 2, backgroundColor: 5, collarColor: 2 } },
  { id: 3, name: '赛博虎', dna: { foreheadShape: 1, eyesShape: 3, animation: 2, headColor: 3, pawsColor: 2, decorationColor: 1, eyesColor: 3, mouthColor: 3, backgroundColor: 3, collarColor: 1 } },
  { id: 4, name: '月兔猫', dna: { foreheadShape: 4, eyesShape: 1, animation: 4, headColor: 1, pawsColor: 1, decorationColor: 4, eyesColor: 4, mouthColor: 4, backgroundColor: 1, collarColor: 4 } },
  { id: 5, name: '粉樱', dna: { foreheadShape: 2, eyesShape: 4, animation: 5, headColor: 4, pawsColor: 5, decorationColor: 3, eyesColor: 1, mouthColor: 1, backgroundColor: 2, collarColor: 3 } },
  { id: 6, name: '星空', dna: { foreheadShape: 3, eyesShape: 2, animation: 6, headColor: 5, pawsColor: 2, decorationColor: 4, eyesColor: 2, mouthColor: 2, backgroundColor: 5, collarColor: 4 } },
  { id: 7, name: '暗夜', dna: { foreheadShape: 1, eyesShape: 3, animation: 1, headColor: 3, pawsColor: 3, decorationColor: 1, eyesColor: 3, mouthColor: 3, backgroundColor: 3, collarColor: 1 } },
  { id: 8, name: '向阳', dna: { foreheadShape: 4, eyesShape: 4, animation: 2, headColor: 2, pawsColor: 4, decorationColor: 2, eyesColor: 4, mouthColor: 4, backgroundColor: 4, collarColor: 2 } },
  { id: 9, name: '幽灵', dna: { foreheadShape: 2, eyesShape: 1, animation: 4, headColor: 1, pawsColor: 1, decorationColor: 5, eyesColor: 1, mouthColor: 1, backgroundColor: 1, collarColor: 5 } },
  { id: 10, name: '暮光', dna: { foreheadShape: 5, eyesShape: 5, animation: 3, headColor: 4, pawsColor: 1, decorationColor: 3, eyesColor: 5, mouthColor: 5, backgroundColor: 2, collarColor: 4 } },
  { id: 11, name: '银河', dna: { foreheadShape: 6, eyesShape: 6, animation: 1, headColor: 5, pawsColor: 5, decorationColor: 6, eyesColor: 6, mouthColor: 6, backgroundColor: 5, collarColor: 6 } },
  { id: 12, name: '光之子', dna: { foreheadShape: 1, eyesShape: 6, animation: 5, headColor: 2, pawsColor: 2, decorationColor: 4, eyesColor: 1, mouthColor: 1, backgroundColor: 4, collarColor: 2 } },
];
