import React, { useMemo, useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { Button, Row, Col, Card, Typography, Space, Tag, Grid, Skeleton } from "antd";
import { ThunderboltOutlined, CrownOutlined, RocketOutlined, GiftOutlined, SafetyCertificateOutlined, LockOutlined } from "@ant-design/icons";
import { useReadContract } from 'wagmi';
import { useTheme } from "../themes/ThemeContext.js";
import { contractCfg } from "../contractCfg.js";
import RenderCat from "./elements/RenderCat.js";
import styles from "./styles/home.module.css";

const RANDOM_NAMES = ['霓虹喵','紫水晶','赛博虎','月兔猫','粉樱','星空','暗夜','向阳','幽灵','暮光','银河','光之子','流星','极光','幻影','闪电','月影','晨曦','暮云','极昼','霜华','琥珀','翠玉','幽蓝','朱砂','鸦青','霜蓝','檀香','鸢尾','薄荷','石榴','琥珀'];

const generateRandomCat = (id) => ({
  id,
  name: RANDOM_NAMES[(id - 1) % RANDOM_NAMES.length],
  dna: {
    foreheadShape: Math.floor(Math.random() * 6) + 1,
    eyesShape: Math.floor(Math.random() * 6) + 1,
    animation: Math.floor(Math.random() * 6) + 1,
    headColor: Math.floor(Math.random() * 89) + 10,
    pawsColor: Math.floor(Math.random() * 89) + 10,
    decorationColor: Math.floor(Math.random() * 89) + 10,
    eyesColor: Math.floor(Math.random() * 89) + 10,
    mouthColor: Math.floor(Math.random() * 89) + 10,
    backgroundColor: Math.floor(Math.random() * 4) + 1,
    collarColor: Math.floor(Math.random() * 89) + 10,
  },
});

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

// 数字滚动计数动画：从 0 滚到目标值
function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current;
    const end = typeof value === 'number' ? value : 0;
    if (start === end) return;
    const t0 = performance.now();
    let raf;
    const step = (now) => {
      const elapsed = now - t0;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);
      if (progress < 1) raf = requestAnimationFrame(step);
      else prev.current = end;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{display}</>;
}

function Home() {
  const { theme } = useTheme();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // 每次刷新随机生成 12 只 SAMPLE 猫（DNA 全随机 1-99，背景 1-4）
  const SAMPLE_CATS = useMemo(
    () => Array.from({ length: 12 }, (_, i) => generateRandomCat(i + 1)),
    []
  );

  // 链上数据：totalSupply + getAllTokenOnSale
  // viem 2.x 空 uint256[] 报 "no data"，但 wagmi useReadContract 内部 catch 后 data 保持 undefined
  // 我们把 undefined 当 0 处理即可
  const { data: totalSupply } = useReadContract({
    address: contractCfg.contractCatAddress,
    abi: contractCfg.contractCatABI,
    functionName: 'totalSupply',
  });
  const { data: onSale } = useReadContract({
    address: contractCfg.contractMarketAddress,
    abi: contractCfg.contractMarketABI,
    functionName: 'getAllTokenOnSale',
  });

  // 超时 fallback：3 秒后还没拿到数据 → 显示 0
  // 解决：未连钱包/链未通时永远 skeleton 的问题
  const [fallbackReady, setFallbackReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFallbackReady(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const mintedCount = (totalSupply !== undefined && totalSupply !== null)
    ? Number(totalSupply)
    : (fallbackReady ? 0 : null);
  const onSaleCount = Array.isArray(onSale)
    ? onSale.length
    : (fallbackReady ? 0 : null);
  // 加载中超过 3s 视为合约未部署/连接失败，显示 0
  const showLoading = (val) => val === null;

  const heroStyle = {
    position: 'relative',
    overflow: 'hidden',
    background: theme.bannerImage,
    borderRadius: isMobile ? 16 : 28,
    padding: isMobile ? '40px 16px' : '80px 48px',
    marginTop: isMobile ? 16 : 32,
    marginBottom: isMobile ? 32 : 56,
    textAlign: 'center',
    border: `1px solid ${theme.cssVars['--border-color']}`,
    boxShadow: theme.cssVars['--shadow-card'],
  };

  // Hero 装饰：浮动猫爪/星星 emoji 背景元素
  const floatingDecor = [
    { emoji: '🐾', style: { top: '8%',  left: '5%',  size: 48, delay: '0s'   } },
    { emoji: '✨', style: { top: '15%', right: '8%', size: 36, delay: '0.5s' } },
    { emoji: '🐱', style: { bottom: '12%', left: '8%', size: 56, delay: '1s'   } },
    { emoji: '🌟', style: { bottom: '20%', right: '5%', size: 42, delay: '1.5s' } },
    { emoji: '🎨', style: { top: '50%', left: '3%',  size: 32, delay: '2s'   } },
    { emoji: '💎', style: { top: '40%', right: '3%', size: 38, delay: '0.8s' } },
  ];

  return (
    <div className={styles.homeWrap}>
      {/* Hero */}
      <div style={heroStyle}>
        {/* 浮动装饰元素 */}
        {floatingDecor.map((d, i) => (
          <span key={i} className={styles.floatDecor} style={{
            ...d.style,
            fontSize: d.style.size,
            animationDelay: d.style.delay,
          }}>{d.emoji}</span>
        ))}
        {/* 渐变光斑装饰 */}
        <div className={styles.heroGlow} style={{ top: '-30%', left: '-10%' }} />
        <div className={styles.heroGlow} style={{ bottom: '-30%', right: '-10%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 70%)' }} />

        <Space direction="vertical" size="large" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
          <Tag color="magenta" style={{ fontSize: 13, padding: '4px 14px', borderRadius: 20 }}>
            <ThunderboltOutlined /> 基于 Hardhat Local · chainId 31337
          </Tag>
          <Title level={1} className={styles.heroTitle} style={{
            margin: 0,
            fontSize: isMobile ? 36 : 56,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            Crypto Cat NFT
          </Title>
          <Paragraph style={{
            fontSize: isMobile ? 14 : 18,
            color: theme.cssVars['--text-secondary'],
            maxWidth: 640,
            margin: '0 auto',
          }}>
            每一只加密猫都是独一无二的数字收藏品，由链上 DNA 决定外观。
            铸造 · 繁殖 · 交易 · 收集，<Text strong style={{ color: theme.cssVars['--accent-pink'] }}>全部由智能合约保障</Text>。
          </Paragraph>
          <Space size="middle" wrap style={{ justifyContent: 'center' }}>
            <Link to="/factory">
              <Button type="primary" size="large" icon={<RocketOutlined />} className={styles.btnPrimary} style={{
                height: isMobile ? 44 : 52, padding: isMobile ? '0 20px' : '0 32px', fontSize: isMobile ? 14 : 16, fontWeight: 600,
              }}>
                开始铸造
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="large" icon={<CrownOutlined />} className={styles.btnSecondary} style={{
                height: isMobile ? 44 : 52, padding: isMobile ? '0 20px' : '0 32px', fontSize: isMobile ? 14 : 16, fontWeight: 600,
                background: 'transparent', border: `1px solid ${theme.cssVars['--border-color']}`,
                color: theme.cssVars['--text-primary'],
              }}>
                浏览市场
              </Button>
            </Link>
          </Space>
        </Space>
      </div>

      {/* Trust 信号 */}
      <div style={{
        textAlign: 'center',
        marginBottom: 32,
        color: theme.cssVars['--text-secondary'],
        fontSize: 13,
        display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <span><LockOutlined style={{ marginRight: 4, color: theme.cssVars['--accent-pink'] }} />所有权完全在链上</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span><SafetyCertificateOutlined style={{ marginRight: 4, color: theme.cssVars['--accent-purple'] }} />智能合约自动执行</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>🎨 DNA 决定外观，不可篡改</span>
      </div>

      {/* Stats — 链上真数据 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
        {(() => {
          const stats = [
            { label: '示例品种', value: SAMPLE_CATS.length, suffix: '+', color: theme.cssVars['--accent-pink'] },
            { label: '链上铸造', value: mintedCount, color: theme.cssVars['--accent-purple'] },
            { label: '在售交易', value: onSaleCount, color: theme.cssVars['--accent-blue'] },
            { label: '合约地址', value: contractCfg.contractCatAddress.slice(0, 6) + '…' + contractCfg.contractCatAddress.slice(-4), color: theme.cssVars['--accent-cyan'], isAddress: true },
          ];
          return stats.map((s, i) => (
            <Col xs={12} sm={6} key={i}>
              <Card hoverable className={styles.statCard} style={{
                textAlign: 'center',
                background: theme.cssVars['--bg-secondary'],
                border: `1px solid ${theme.cssVars['--border-color']}`,
                borderRadius: 16,
                boxShadow: theme.cssVars['--shadow-card'],
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
                styles={{ body: { padding: isMobile ? '16px 8px' : '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' } }}
              >
                <div style={{ minHeight: s.isAddress ? 24 : 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                  {showLoading(s.value) ? (
                    <Skeleton.Input active size="small" style={{ width: s.isAddress ? 100 : 60, height: s.isAddress ? 18 : 28 }} />
                  ) : s.isAddress ? (
                    <span style={{ fontSize: isMobile ? 13 : 16, fontWeight: 800, color: s.color, fontFamily: 'monospace', lineHeight: 1.1 }}>
                      {s.value}
                    </span>
                  ) : (
                    <span style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: s.color, lineHeight: 1.1 }}>
                      <AnimatedNumber value={s.value} />
                      {s.suffix || ''}
                    </span>
                  )}
                </div>
                <div style={{ color: theme.cssVars['--text-secondary'], fontSize: 12, marginTop: 0 }}>{s.label}</div>
              </Card>
            </Col>
          ));
        })()}
      </Row>

      {/* Sample cats */}
      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ color: theme.cssVars['--text-primary'], marginBottom: 8 }}>
          <GiftOutlined /> 示例加密猫
        </Title>
        <Paragraph style={{ color: theme.cssVars['--text-secondary'], marginBottom: 24 }}>
          连接钱包并铸造你的第一只猫 — DNA 由链上算法生成，真正独一无二
        </Paragraph>
        <Row gutter={[20, 20]}>
          {SAMPLE_CATS.map(cat => (
            <Col xs={24} sm={12} md={8} key={cat.id}>
              <Card
                hoverable
                style={{
                  background: theme.cssVars['--bg-secondary'],
                  border: `1px solid ${theme.cssVars['--border-color']}`,
                  borderRadius: 18,
                  overflow: 'hidden',
                  boxShadow: theme.cssVars['--shadow-card'],
                }}
                styles={{ body: { padding: 16 } }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
                  <RenderCat dna={cat.dna} />
                </div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ color: theme.cssVars['--text-primary'], fontSize: 16 }}>
                    #{cat.id} {cat.name}
                  </Text>
                  <Tag color="purple" style={{ borderRadius: 12 }}>示例</Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;
