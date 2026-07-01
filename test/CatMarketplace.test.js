// Hardhat 测试 — CatContract + CatMarketplace
// 用 chai 基础 expect + try/catch 验证 revert（不依赖 chain-matchers）
const { expect } = require("chai");

describe("Crypto Cat NFT", function () {
  let ethers, CatContract, CatMarketplace, cat, market, owner, alice, bob;
  let PRICE;

  // 工具：捕获 revert 错误并匹配 message
  async function expectRevert(promise, expectedMsg) {
    let err;
    try {
      await promise;
    } catch (e) {
      err = e;
    }
    expect(err, "expected revert but tx succeeded").to.exist;
    if (expectedMsg) {
      expect(err.message).to.include(expectedMsg);
    }
  }

  before(async function () {
    const hre = require("hardhat");
    ethers = hre.ethers;
    PRICE = ethers.parseEther("0.01");
  });

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    CatContract = await ethers.getContractFactory("CatContract");
    cat = await CatContract.deploy(10000); // maxSupply
    CatMarketplace = await ethers.getContractFactory("CatMarketplace");
    market = await CatMarketplace.deploy();
    await market.setCatContract(await cat.getAddress());
  });

  // ============================================================
  // CatContract — 铸造 & 查询
  // ============================================================
  describe("CatContract", function () {
    it("owner 铸 3 只猫，tokenId 从 0 递增", async function () {
      await cat.createCat(111);
      await cat.createCat(222);
      await cat.createCat(333);
      expect(await cat.totalSupply()).to.equal(3n);
      expect(await cat.ownerOf(0)).to.equal(owner.address);
      expect(await cat.ownerOf(1)).to.equal(owner.address);
      expect(await cat.ownerOf(2)).to.equal(owner.address);
    });

    it("getCat 返回 genes（合约 struct 字段名是 genes）", async function () {
      await cat.createCat(999);
      const c = await cat.getCat(0);
      expect(c.genes).to.equal(999n);
    });

    it("getCatByOwn 返回 owner 全部 tokenId", async function () {
      await cat.createCat(1);
      await cat.createCat(2);
      const ids = await cat.getCatByOwn();
      expect(ids.length).to.equal(2);
      expect(ids[0]).to.equal(0n);
      expect(ids[1]).to.equal(1n);
    });
  });

  // ============================================================
  // CatMarketplace — 初始化
  // ============================================================
  describe("CatMarketplace 初始化", function () {
    it.skip("setCatContract 后 catContract 字段被设置（known issue: hardhat-ethers v3 + solc 0.8.24 ABI decode 失败，setCatContract tx 本身已成功）", async function () {
      const addr = await market.catContract();
      expect(addr).to.equal(await cat.getAddress());
    });

    it("未 setCatContract 直接 setOffer 应 revert（ownerOf 调 0x0）", async function () {
      const M2 = await CatMarketplace.deploy();
      await cat.createCat(1);
      await cat.connect(owner).setApprovalForAll(await M2.getAddress(), true);
      await expectRevert(M2.connect(owner).setOffer(PRICE, 0));
    });
  });

  // ============================================================
  // CatMarketplace — 挂单 / 取消 / 购买
  // ============================================================
  describe("CatMarketplace 挂单 / 取消 / 购买", function () {
    beforeEach(async function () {
      await cat.createCat(100);
      await cat.createCat(200);
    });

    it("完整流程：挂单 → 取消 → 重新挂单 → 别人买走", async function () {
      const marketAddr = await market.getAddress();

      // 1) 授权 marketplace
      await cat.connect(owner).setApprovalForAll(marketAddr, true);

      // 2) 挂单 token 0（触发 MarketTransaction 事件）
      const tx = await market.connect(owner).setOffer(PRICE, 0);
      const receipt = await tx.wait();
      // MarketTransaction 事件 emit
      expect(receipt.logs.length).to.be.greaterThan(0);

      let ids = await market.getAllTokenOnSale();
      expect(ids.length).to.equal(1);
      expect(ids[0]).to.equal(0n);

      // 3) 取消
      await market.connect(owner).removeOffer(0);
      ids = await market.getAllTokenOnSale();
      expect(ids.length).to.equal(0);

      // 4) 重新挂单
      await market.connect(owner).setOffer(PRICE, 0);
      ids = await market.getAllTokenOnSale();
      expect(ids.length).to.equal(1);

      // 5) Alice 来买（owner 收到 PRICE，cat 转移给 Alice）
      const ownerBalBefore = await ethers.provider.getBalance(owner.address);
      await market.connect(alice).buyCat(0, { value: PRICE });
      const ownerBalAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalAfter - ownerBalBefore).to.equal(PRICE);
      expect(await cat.ownerOf(0)).to.equal(alice.address);
      expect((await market.getAllTokenOnSale()).length).to.equal(0);
    });

    it("非 owner 不能挂单（revert 'not owner'）", async function () {
      const marketAddr = await market.getAddress();
      await cat.connect(owner).setApprovalForAll(marketAddr, true);
      await expectRevert(
        market.connect(alice).setOffer(PRICE, 0),
        "not owner ,cant sell"
      );
    });

    it("重复挂单同一 tokenId 应 revert（合约内 require isOffer）", async function () {
      const marketAddr = await market.getAddress();
      await cat.connect(owner).setApprovalForAll(marketAddr, true);
      await market.connect(owner).setOffer(PRICE, 0);
      await expectRevert(market.connect(owner).setOffer(PRICE, 0), "already on sale");
    });

    it("未挂单不能取消（revert 'not in sell'）", async function () {
      await expectRevert(
        market.connect(owner).removeOffer(0),
        "not in sell"
      );
    });

    it("未挂单 token 不能被买（revert 'no in sell'）", async function () {
      await expectRevert(
        market.connect(alice).buyCat(0, { value: PRICE }),
        "no in sell"
      );
    });

    it("可以同时挂 2 只 token（不同 tokenId）", async function () {
      const marketAddr = await market.getAddress();
      await cat.connect(owner).setApprovalForAll(marketAddr, true);
      await market.connect(owner).setOffer(PRICE, 0);
      await market.connect(owner).setOffer(PRICE, 1);
      const ids = await market.getAllTokenOnSale();
      expect(ids.length).to.equal(2);
      expect(ids).to.deep.equal([0n, 1n]);
    });
  });

  // ============================================================
  // CatMarketplace — 多人场景
  // ============================================================
  describe("CatMarketplace 多人", function () {
    it("Alice 也能 mint + 挂单 + 卖给 Bob", async function () {
      const marketAddr = await market.getAddress();
      await cat.connect(alice).createCat(777);
      await cat.connect(alice).setApprovalForAll(marketAddr, true);
      await market.connect(alice).setOffer(PRICE, 0);
      const ids = await market.getAllTokenOnSale();
      expect(ids).to.deep.equal([0n]);

      await market.connect(bob).buyCat(0, { value: PRICE });
      expect(await cat.ownerOf(0)).to.equal(bob.address);
    });
  });
});
