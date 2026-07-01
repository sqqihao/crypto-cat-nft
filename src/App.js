import React from 'react';
import { Layout, Space, Typography, Tooltip } from 'antd';
import { GithubOutlined, LinkOutlined, RocketOutlined } from '@ant-design/icons';
import Container from "./components/Container";
import { contractCfg } from "./contractCfg.js";
import './App.css';

const { Content, Footer } = Layout;
const { Text } = Typography;

const SHORT_CAT = contractCfg.contractCatAddress
  ? `${contractCfg.contractCatAddress.slice(0, 6)}…${contractCfg.contractCatAddress.slice(-4)}`
  : '0x…';
const SHORT_MARKET = contractCfg.contractMarketAddress
  ? `${contractCfg.contractMarketAddress.slice(0, 6)}…${contractCfg.contractMarketAddress.slice(-4)}`
  : '0x…';

// Hardhat Local 链没有 etherscan，给空链接
const isHardhat = !contractCfg.contractCatAddress || contractCfg.contractCatAddress.startsWith('0x2279') || contractCfg.contractCatAddress.startsWith('0x5fbd');
const explorerBase = isHardhat ? null : `https://sepolia.etherscan.io/address`;

function App() {
  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Content style={{
        minHeight: 'calc(100vh - 70px)',
        padding: '48px 48px 32px',
        maxWidth: 1600,
        margin: '0 auto',
        width: '100%',
      }}>
        <Container />
      </Content>
      <Footer className="app-footer" style={{
        textAlign: 'center',
        background: 'transparent',
        color: 'var(--text-primary)',
        borderTop: '1px solid var(--border-color)',
        padding: '24px 24px 28px',
      }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Space size="middle" wrap>
            <Text type="secondary" style={{ fontSize: 13 }}>
              <RocketOutlined /> Crypto Cat NFT © 2026
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>·</Text>
            <Tooltip title={contractCfg.contractCatAddress || 'N/A'}>
              <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
                Cat: {SHORT_CAT}
              </Text>
            </Tooltip>
            <Tooltip title={contractCfg.contractMarketAddress || 'N/A'}>
              <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
                Market: {SHORT_MARKET}
              </Text>
            </Tooltip>
          </Space>
          <Space size="middle" wrap>
            <Text type="secondary" style={{ fontSize: 11 }}>
              Powered by Hardhat + Wagmi + RainbowKit
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>·</Text>
            <a
              href="https://github.com/sqqihao/crypto-cat-nft"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 11, color: 'var(--text-secondary)' }}
            >
              <GithubOutlined /> GitHub
            </a>
          </Space>
        </Space>
      </Footer>
    </Layout>
  );
}

export default App;
