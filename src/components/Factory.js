import React, { useState } from "react";
import { Button, Card, Row, Col, Typography, Space, Tag } from "antd";
import { ThunderboltOutlined, ReloadOutlined, GiftOutlined, RocketOutlined } from "@ant-design/icons";
import { writeContract } from '@wagmi/core';
import { useAccount } from 'wagmi';
import RenderCat from "./elements/RenderCat.js";
import Attributes from "./elements/Attributes.js";
import { config } from "../wagmiconf.js";
import { contractCfg } from "../contractCfg.js";
import { util } from "./util.js";
import { useTheme } from "../themes/ThemeContext.js";

const { Title, Paragraph, Text } = Typography;

const defaultDna = {
  foreheadShape: 2, eyesShape: 6, animation: 6,
  headColor: 40, collarColor: 40, pawsColor: 40,
  decorationColor: 14, eyesColor: 20, mouthColor: 20,
  backgroundColor: 10,
};

const COLOR_NAMES = ['白','黄','粉','紫','蓝','红','绿','橙','黑','彩虹','暮色','极光','薰衣草','薄荷','焦糖','星尘','月光','玫瑰','琥珀','雪松','樱桃','莓果','蓝莓','抹茶','奶咖','蜜桃','珊瑚','紫罗兰','翡翠','檀木','烈焰','深海','金沙','茶绿','晨曦','蒲公英','抹茶绿','橘子','青柠','青梅','棉花','薄雾','日出','日落','雾蓝','秋叶','春芽','夏夜','冬雪','海洋','森林','沙漠','夜空','火山','冰川','峡谷','草原','玫瑰园','丁香','郁金香','莲花','兰花','茉莉','桂花','菊花','梅花','桃花','杏花','梨花','樱花','海棠','玉兰','牡丹','芍药','月季','茶花','杜鹃','百合','向日葵','薰衣草田','普罗旺斯','托斯卡纳','香榭丽舍','霓虹街','赛博城','银河系','星际','月球','火星','木星','土星','天王星','海王星','冥王星'];

function Factory() {
  const { theme } = useTheme();
  const { isConnected } = useAccount();
  const [dna, setDna] = useState(defaultDna);

  const resetCatToDefault = () => setDna(defaultDna);

  const generateRandomCat = () => {
    const randomIndex = Math.floor(Math.random() * 100);
    const randomDna = {
      headColor: Math.floor(Math.random() * 89) + 10,
      mouthColor: Math.floor(Math.random() * 89) + 10,
      pawsColor: Math.floor(Math.random() * 89) + 10,
      eyesColor: Math.floor(Math.random() * 89) + 10,
      collarColor: Math.floor(Math.random() * 89) + 10,
      eyesShape: Math.floor(Math.random() * 6) + 1,
      foreheadShape: Math.floor(Math.random() * 6) + 1,
      decorationColor: Math.floor(Math.random() * 89) + 10,
      animation: Math.floor(Math.random() * 6) + 1,
      backgroundColor: Math.floor(Math.random() * 4) + 1,
    };
    setDna(randomDna);
    console.log(`[Factory] 已随机生成 #${randomIndex} ${COLOR_NAMES[randomIndex] || '新猫'}喵`);
  };

  const handleMint = async () => {
    if (!isConnected) {
      console.warn('[Factory] 请先连接钱包');
      return;
    }
    try {
      const dnaString = util.getDnaString(dna);
      const txResult = await writeContract(config, {
        address: contractCfg.contractCatAddress,
        abi: contractCfg.contractCatABI,
        functionName: "createCat",
        args: [dnaString],
      });
      console.log('[Factory] Mint 成功！交易哈希: ' + txResult);
    } catch (err) {
      console.error('[Factory] Mint 失败: ' + (err?.shortMessage || err?.message || '未知错误'));
    }
  };

  const updateDna = (_dna) => setDna(JSON.parse(JSON.stringify(_dna)));

  const dnaString = util.getDnaString(dna);

  const containerStyle = {
    padding: '32px 16px',
    maxWidth: 1280,
    margin: '0 auto',
  };

  const previewCardStyle = {
    background: theme.cssVars['--bg-secondary'],
    border: `1px solid ${theme.cssVars['--border-color']}`,
    borderRadius: 20,
    boxShadow: theme.cssVars['--shadow-card'],
    overflow: 'visible',
  };

  return (
    <div style={containerStyle}>
        {/* Hero */}
        <div style={{
          background: theme.bannerImage,
          borderRadius: 24,
          padding: '48px 32px',
          marginBottom: 40,
          textAlign: 'center',
          border: `1px solid ${theme.cssVars['--border-color']}`,
          boxShadow: theme.cssVars['--shadow-card'],
        }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Tag color="magenta" style={{ fontSize: 13, padding: '4px 14px', borderRadius: 20 }}>
              <ThunderboltOutlined /> 模拟 DNA 生成
            </Tag>
            <Title level={1} style={{
              margin: 0,
              background: 'linear-gradient(90deg, #ff4d8d 0%, #8b5cf6 50%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em',
            }}>
              NFT 铸造工厂
            </Title>
            <Paragraph style={{ fontSize: 16, color: theme.cssVars['--text-secondary'], maxWidth: 560, margin: '0 auto' }}>
              随机生成 DNA → 预览外观 → 满意后链上铸造。每一只猫都独一无二。
            </Paragraph>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          {/* 左：预览 */}
          <Col xs={24} md={12}>
            <Card
              style={previewCardStyle}
              styles={{ body: { padding: 24 } }}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0, color: theme.cssVars['--text-primary'] }}>
                  <GiftOutlined /> DNA 预览
                </Title>
                <Paragraph style={{ margin: '4px 0 0', color: theme.cssVars['--text-secondary'], fontSize: 13 }}>
                  点击下方按钮生成新 DNA
                </Paragraph>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                minHeight: 280, padding: '16px 0',
                background: `linear-gradient(135deg, ${theme.cssVars['--bg-primary']} 0%, ${theme.cssVars['--bg-secondary']} 100%)`,
                borderRadius: 16,
                border: `1px solid ${theme.cssVars['--border-color']}`,
              }}>
                <RenderCat dna={dna} />
              </div>

              {/* DNA 数字 pill */}
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  padding: '6px 16px',
                  borderRadius: 20,
                  fontFamily: 'monospace',
                  fontSize: 14,
                  color: 'white',
                  letterSpacing: '0.05em',
                }}>
                  DNA · {dnaString}
                </div>
              </div>

              <Space size="middle" wrap style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
                <Button size="large" icon={<ReloadOutlined />} onClick={resetCatToDefault}
                  style={{
                    height: 48, padding: '0 24px', fontSize: 15, fontWeight: 600,
                    background: 'transparent', border: `1px solid ${theme.cssVars['--border-color']}`,
                    color: theme.cssVars['--text-primary'],
                  }}>
                  默认 DNA
                </Button>
                <Button size="large" type="primary" icon={<ThunderboltOutlined />} onClick={generateRandomCat}
                  style={{
                    height: 48, padding: '0 28px', fontSize: 15, fontWeight: 600,
                    background: 'linear-gradient(135deg, #ff4d8d 0%, #8b5cf6 100%)',
                    border: 'none', boxShadow: theme.cssVars['--shadow-glow-pink'],
                  }}>
                  随机生成
                </Button>
              </Space>
            </Card>
          </Col>

          {/* 右：属性 + 铸造 */}
          <Col xs={24} md={12}>
            <Card
              style={previewCardStyle}
              styles={{ body: { padding: 24 } }}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0, color: theme.cssVars['--text-primary'] }}>
                  DNA 属性调整
                </Title>
                <Paragraph style={{ margin: '4px 0 0', color: theme.cssVars['--text-secondary'], fontSize: 13 }}>
                  手动微调每条 DNA 后铸造
                </Paragraph>
              </div>
              <div style={{
                padding: 16,
                borderRadius: 12,
                border: `1px solid ${theme.cssVars['--border-color']}`,
                background: theme.cssVars['--bg-primary'],
              }}>
                <Attributes dna={dna} updateDna={updateDna} />
              </div>

              <div style={{ marginTop: 20 }}>
                <Button
                  block size="large" type="primary" icon={<RocketOutlined />}
                  onClick={handleMint}
                  style={{
                    height: 56, fontSize: 17, fontWeight: 700,
                    background: isConnected
                      ? 'linear-gradient(135deg, #ff4d8d 0%, #8b5cf6 100%)'
                      : theme.cssVars['--bg-tertiary'],
                    border: 'none', boxShadow: isConnected ? theme.cssVars['--shadow-glow-pink'] : 'none',
                    color: isConnected ? 'white' : theme.cssVars['--text-secondary'],
                  }}
                >
                  {isConnected ? '铸造这只猫' : '请先连接钱包'}
                </Button>
                <Paragraph style={{ textAlign: 'center', fontSize: 12, color: theme.cssVars['--text-secondary'], marginTop: 12, marginBottom: 0 }}>
                  合约地址 · <Text code style={{ fontSize: 11 }}>{contractCfg.contractCatAddress.slice(0, 6)}…{contractCfg.contractCatAddress.slice(-4)}</Text>
                </Paragraph>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
  );
}

export default Factory;