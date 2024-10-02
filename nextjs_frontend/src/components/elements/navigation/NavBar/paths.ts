import { type ISubNav } from "../SubNav/SubNav";

const NAV_LINKS: ISubNav[] = [
  {
    label: "NFT猫列表",
    href: "/myCats",
    children: [
      {
        label: "猫列表",
        subLabel: "显示已有的猫",
        href: "/myCats/show",
      },
      {
        label: "哺育",
        subLabel: "交配生成小猫",
        href: "/myCats/breed",
      },
      {
        label: "出售",
        subLabel: "在市场出售",
        href: "/myCats/sell",
      },
    ],
  },
  {
    label: "NFT猫市场",
    href: "/marketplace",
  },
  {
    label: "NFT猫工厂",
    href: "/factory",
  },
];

export default NAV_LINKS;
