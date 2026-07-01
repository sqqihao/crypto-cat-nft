# 🐱 Crypto Cat NFT

> 基于区块链的生成式加密猫 NFT 平台 — 铸造 · 繁殖 · 交易 · 收集

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![wagmi](https://img.shields.io/badge/wagmi-2.x-blueviolet)](https://wagmi.sh/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.28-yellow)](https://hardhat.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

在线预览 → **https://sqqihao.github.io/crypto-cat-nft/build/**

---

## ✨ 项目特点

- 🎨 **生成式加密猫** — 10 个 DNA 属性（眼睛/额头/动画/头色/爪色/装饰/眼色/嘴色/背景/项圈色）组合出独特造型
- 🧬 **链上繁殖** — 两只猫配对产生新猫（`Breed` 函数 + 链上算法）
- 💰 **挂单市场** — 任何人可以挂单出售自己的猫，链上交易
- 🎭 **3 套主题** — Cartoon（默认）/ Cyberpunk / Modern，localStorage 持久化
- 🛡️ **完整合约测试** — 11 passing / 1 skipped（Hardhat + ethers v6 + chai）
- 📱 **响应式** — 桌面横向菜单 + 移动端汉堡 Drawer
- ⚠️ **错误边界** — 任何组件 throw 不会白屏
- 📚 **智能 ABI 生成** — `npm run build` 自动从 artifacts 同步合约配置

---

## 🏗️ 技术栈

| 层级 | 技术 |
|---|---|
| 前端 | React 18 + CRA 5 + Chakra UI 2 + Antd 5 + framer-motion |
| Web3 | wagmi 2.x + viem 2.x |
| 路由 | react-router-dom 6 (HashRouter，适配 GH Pages 子路径) |
| 智能合约 | Solidity 0.8.24 + OpenZeppelin 5.x + Hardhat 2.28 |
| 测试 | Hardhat + ethers v6 + chai |
| 部署 | GitHub Pages (`build/`) + WSL 本地开发 |

---

## 📁 项目结构

```
crypto-cat-nft/
├── contracts/                   # 智能合约
│   ├── CatContract.sol          # ERC721 NFT（createCat / Breed）
│   └── CatMarketplace.sol       # 交易市场（setOffer / buyCat / removeOffer）
├── scripts/
│   ├── deploy.js                # 部署合约 + 自动铸 3 只示例猫
│   └── build-contractCfg.js     # 从 artifacts 同步 ABI + 地址到前端
├── test/
│   └── CatMarketplace.test.js   # 合约测试（11 passing / 1 skipped）
├── src/
│   ├── components/
│   │   ├── Home.js              # 首页（hero + 示例猫 + stats）
│   │   ├── List.js              # 我的猫
│   │   ├── Marketplace.js       # 交易市场（出售 / 购买 / 取消）
│   │   ├── Breed.js             # 繁殖
│   │   ├── Factory.js           # 铸造新猫
│   │   ├── Settings.js          # 主题切换
│   │   ├── Container.js         # HashRouter 路由配置
│   │   ├── ErrorBoundary.jsx    # 错误边界
│   │   ├── DataState.js         # loading/error/empty/success 四态组件
│   │   ├── layouts/Header.js    # 顶导 + 移动端 Drawer 汉堡
│   │   ├── wallet/WalletCard.js # 自实现钱包连接卡
│   │   ├── model/
│   │   │   ├── read.js          # 链上读（getCatByOwn / getCat / getOffer）
│   │   │   └── write.js         # 链上写（统一返 {ok,tx/error}）
│   │   ├── elements/
│   │   │   ├── RenderCat.js     # 单猫卡渲染（解包 DNA）
│   │   │   └── CatParts/        # 眼睛/耳朵/身体/额头 部件（SVG）
│   │   ├── themes/              # 3 套主题（cyberpunk / modern / cartoon）
│   │   └── data/sampleCats.js   # SAMPLE mock data
│   ├── hooks/useSafeReadContract.js  # useDataFetcher（带 cancelled ref cleanup）
│   ├── wagmiconf.js             # wagmi 配置（7 链 + local 31337）
│   ├── contractCfg.js           # AUTO-GENERATED — ABI + 地址
│   └── App.js / App.css / index.js # 入口 + Providers 嵌套
├── artifacts/                   # hardhat 编译产物
├── cache/                       # hardhat 增量缓存
├── build/                       # CRA production build 输出 (GitHub Pages 根)
├── deployed-addresses.json      # 当前部署的合约地址
├── hardhat.config.js            # Hardhat minimal config (无 toolbox)
└── package.json                 # npm scripts（prebuild + prestart 自动同步）
```

---

## 🚀 快速开始（本地开发）

### 1. 安装依赖

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` 是必需的（react-scripts 5 + wagmi 2 peer dep 冲突）。

### 2. 启动本地 Hardhat 节点

```bash
# 终端 1
npx hardhat node --hostname 0.0.0.0 --port 8545
```

输出会列出 20 个测试账号，每个有 10000 ETH。**Account #0** = `0xf39F...92266`，它是所有合约的 deployer。

### 3. 部署合约

```bash
# 终端 2
npm run deploy
```

执行流程：
1. 编译合约（hardhat 自动）
2. 部署 `CatContract.sol`（ERC721）→ 拿到地址
3. 部署 `CatMarketplace.sol` → 拿到地址
4. 把 Cat 地址注入 Marketplace（`setCatContract()`）
5. 把两个地址写入 `deployed-addresses.json`
6. 给 deployer 账号自动铸 3 只 SAMPLE 猫
7. `prestart` / `prebuild` 钩子自动同步 ABI + 地址到 `src/contractCfg.js`

输出示例：
```
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
CatContract:    0x5FbDB2315678afecb367f032d93F642f64180aa3
CatMarketplace: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
setCatContract tx: 0x...
Minted cat #0 (packedDNA=...) tx=0x...
Minted cat #1 (packedDNA=...) tx=0x...
Minted cat #2 (packedDNA=...) tx=0x...
Final totalSupply: 3
```

### 4. 启动前端 dev server

```bash
# 终端 3
npm start
```

打开 `http://localhost:3000` 或 WSL IP `http://172.31.x.x:3000`。

**WSL / 远程 VM 必须**：`HOST=0.0.0.0 PORT=4445 npx react-scripts start`
（默认 bind localhost，外部 IP 访问不到。）

### 5. 连接 MetaMask

1. 安装 [MetaMask](https://metamask.io)
2. 添加自定义网络：
   - **网络名**：Hardhat Local
   - **RPC URL**：`http://127.0.0.1:8545`（或 WSL IP `http://172.31.x.x:8545`）
   - **Chain ID**：`31337`
   - **Currency Symbol**：ETH
3. 导入测试账户 #0 私钥：`0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
4. 点页面右上角 **连接钱包** → MetaMask 弹窗 → 确认

---

## 📜 NPM 脚本

| 命令 | 作用 |
|---|---|
| `npm start` | dev server（前置 `prestart` 自动同步 ABI + 地址） |
| `npm run build` | production build 到 `build/`（前置 `prebuild` 同步 ABI + 地址） |
| `npm run deploy` | 部署合约到本地 Hardhat 节点（含 setCatContract + 铸 3 SAMPLE 猫） |
| `npm run build-contractCfg` | 手动从 artifacts 重新生成 `src/contractCfg.js` |
| `npm test` | 跑 React 组件测试（jest） |
| `npm run test:contracts` | 跑合约测试（Hardhat + chai） |

---

## 🧪 合约测试

```bash
npm run test:contracts
```

```
Crypto Cat NFT
  CatContract
    ✔ owner 铸 3 只猫，tokenId 从 0 递增
    ✔ getCat 返回 genes（合约 struct 字段名是 genes）
    ✔ getCatByOwn 返回 owner 全部 tokenId
  CatMarketplace 初始化
    - setCatContract 后 catContract 字段被设置（known issue: hardhat-ethers 解码）
    ✔ 未 setCatContract 直接 setOffer 应 revert
  CatMarketplace 挂单 / 取消 / 购买
    ✔ 完整流程：挂单 → 取消 → 重新挂单 → 别人买走
    ✔ 非 owner 不能挂单（revert 'not owner'）
    ✔ 重复挂单同一 tokenId 应 revert
    ✔ 未挂单不能取消（revert 'not in sell'）
    ✔ 未挂单 token 不能被买（revert 'no in sell'）
    ✔ 可以同时挂 2 只 token
  CatMarketplace 多人
    ✔ Alice 也能 mint + 挂单 + 卖给 Bob

  11 passing (2s)
  1 pending
```

**改动合约前必跑**：防止破坏已有功能。

---

## 🌐 部署前端到 GitHub Pages

本项目静态构建输出到 `build/`，push 后直接通过 GitHub Pages 访问，**无需** gh-pages 分支。

### 一次性配置

1. 创建 `sqqihao/crypto-cat-nft` 仓库
2. Settings → Pages → Source：选 **Deploy from a branch** → `main` branch / `/(root)` 或 `/build`
3. 如果 Pages 根直接指向 `build/`，访问 URL 为 `https://sqqihao.github.io/crypto-cat-nft/build/`

### workflow（每次发布）

```bash
cd /home/admini/ai/crypto-cat-nft

# 1) 安装（首次）
npm install --legacy-peer-deps

# 2) 生产构建（自动跑 prebuild → 同步 ABI + 地址 → 输出到 build/）
npm run build

# 3) 提交 + 推送
git add README.md src/ contracts/ scripts/ test/ build/
git commit -m "发布 vX.Y: <改动说明>"
git push origin main
```

### 重要细节

**HashRouter**：本项目路由用 `HashRouter`，**全部路径在 URL hash 内**（`#/marketplace`），不依赖 server fallback。GitHub Pages 静态托管**无需** 404.html 重写，**能直接访问任何子路径**。

**homepage 字段**：`package.json` 写的是 `"homepage": "."`（相对路径），目的是同一份 build 既能被 `file://` / 本地静态服务打开，也能被 GH Pages 服务。**不要**改成绝对路径，否则开发模式 + GitHub Pages 双套产物。

**环境 RPC**：dev 默认走本地 hardhat（`http://127.0.0.1:8545`）。如需切到公网测试网（Sepolia），详见下方「切换到公网链」章节。

---

## 🔧 切换到公网测试网（Sepolia 示范）

`src/wagmiconf.js` 默认连 7 条链（含 `sepolia`），把 Sepolia RPC 写到 `.env` 即可启用。

### 步骤

```bash
# 1. 拿到测试 ETH（水龙头：https://sepoliafaucet.com）

# 2. 把私钥写到 .env
echo 'PRIVATE_KEY=0xac0974...' >> .env
echo 'SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com' >> .env

# 3. 注册 sepolia 网络到 hardhat.config.js（已默认配好）

# 4. 部署
npx hardhat run scripts/deploy.js --network sepolia

# 5. 重新 build（prebuild 自动同步新地址到 src/contractCfg.js）
npm run build
```

### 支持的链

| 链 | chainId | 默认 RPC |
|---|---|---|
| Hardhat Local | 31337 | `http://127.0.0.1:8545` |
| Sepolia | 11155111 | `https://ethereum-sepolia-rpc.publicnode.com` |
| Mainnet | 1 | `https://ethereum-rpc.publicnode.com` |
| Polygon | 137 | `https://polygon-bor-rpc.publicnode.com` |
| Arbitrum | 42161 | `https://arbitrum-one-rpc.publicnode.com` |
| Optimism | 10 | `https://optimism-rpc.publicnode.com` |
| Base | 8453 | `https://base-rpc.publicnode.com` |
| BNB Chain | 56 | `https://bsc.publicnode.com` |

全部走 publicnode.com 免费公共节点，**无需 API key**。

---

## 📦 合约说明

### CatContract (ERC721)

```solidity
constructor(uint256 _max_suplly)              // 最大供应量
function createCat(uint256 _dna) public       // 铸造（需支付 mint fee）
function Breed(uint256 _dadId, uint256 _mumId) // 两只猫繁殖
function getCat(uint256 _id) view returns (Cat memory)  // DNA
function getCatByOwn() view returns (uint256[] memory) // 自己持有 tokenId
```

**Cat struct**（链上 packed 数据，每个 uint256 装 10 个 1 位数）：
- `indexId` / `generation` / `birthTime` / `genes` / `dadId` / `mumId`
- `genes` 解包后：`{eyesShape, foreheadShape, animation, headColor, pawsColor, decorationColor, eyesColor, mouthColor, backgroundColor, collarColor}`

### CatMarketplace

```solidity
constructor()
function setCatContract(address _catContractAddress) external  // 注入 Cat 地址（仅 owner 一次）
function setOffer(uint256 _price, uint256 _tokenId) external   // 挂单
function removeOffer(uint256 _tokenId) external                 // 取消挂单
function buyCat(uint256 _tokenId) external payable             // 购买（price wei 随交易）
function getOffer(uint256 _tokenId) view returns (...)         // 查挂单
function getAllTokenOnSale() view returns (uint256[] memory)   // 查所有在售
```

事件：`MarketTransaction(string TxType, address owner, uint256 tokenId)`

**挂单流程**：
1. owner 调 `setApprovalForAll(marketAddr, true)` 授权 marketplace
2. owner 调 `setOffer(price, tokenId)` 挂单
3. 任何人调 `buyCat(tokenId)` 出价购买，ETH 自动转给 seller
4. owner 调 `removeOffer(tokenId)` 取消挂单

---

## 🐛 已知问题 + 状态

| 问题 | 状态 | 说明 |
|---|---|---|
| `market.catContract()` getter 调用 | `it.skip` | hardhat-ethers v3 + solc 0.8.24 ABI 解码失败；功能不受影响（setCatContract tx 成功即可） |
| 链上老猫 DNA 错位 | UI 兜底 | 老 3 只示例猫 DNA 是 16 位 packed int，`util.catDna` 切分后属性值越界。`eyesStructData` / `getColorString` 加 fallback，新部署正常 |
| `viem 2.x` `uint256[]` 空数组 bug | UI 兜底 | viem 在空数组时返回 `0x20...00` 误判为 "no data"。`read.js` 所有相关调用加 try/catch |
| `wagmi simulateContract` 失败不抛错 | 已修 | 保证 `setCatContract` 成功 + 合约地址同步到 `contractCfg.js` |
| Coinbase SDK initCCA reject(undefined) | 已修 | wagmi config 移除 `coinbaseWallet` connector，`injected` 覆盖 |
| antd `<App>` 嵌套 + message static API | 已修 | 删除嵌套 `<App>`，改用 `message.useMessage()` hook |

---

## 🤝 贡献

1. Fork 仓库
2. 改合约前先 `npm run test:contracts` 确认所有测试过
3. 加新功能时同步加测试
4. 提交 PR 时跑 `npm run build` 确认能 build
5. 提交信息尽量简短，中文 OK

---

## 📄 License

MIT

---

## 🙏 致谢

Hardhat 团队 · wagmi + viem 团队 · OpenZeppelin · Ant Design + Chakra UI · 所有 Web3 开源贡献者
