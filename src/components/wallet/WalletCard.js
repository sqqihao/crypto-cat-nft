import React, { useState } from 'react';
import { useAccount, useChainId, useBalance, useDisconnect, useConnect, useSwitchChain } from 'wagmi';
import { Dropdown, message, Tooltip } from 'antd';
import {
  WalletOutlined,
  CopyOutlined,
  LinkOutlined,
  DisconnectOutlined,
  CheckCircleFilled,
  DownOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useTheme } from "../../themes/ThemeContext.js";

const CHAIN_META = {
  1:        { name: 'Ethereum',  color: '#627eea', short: 'ETH' },
  56:       { name: 'BNB Chain', color: '#f0b90b', short: 'BNB' },
  11155111: { name: 'Sepolia',   color: '#5f8d6e', short: 'SEP' },
  31337:    { name: 'Hardhat',   color: '#f7c948', short: 'LOC' },
};

function shortAddr(addr) {
  if (!addr) return '';
  return addr.slice(0, 6) + '…' + addr.slice(-4);
}

function shortBalance(balance) {
  if (!balance) return '0';
  const n = parseFloat(balance.formatted);
  if (n === 0) return '0';
  if (n < 0.0001) return '<0.0001';
  if (n < 1) return n.toFixed(4);
  if (n < 1000) return n.toFixed(3);
  return n.toFixed(2);
}

export default function WalletCard() {
  const { theme } = useTheme();
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { connectors, connect, isPending } = useConnect();
  const { switchChain, isPending: switching } = useSwitchChain();
  const [copied, setCopied] = useState(false);

  if (!isConnected) {
    // Find first connector that has a getProvider (i.e. has wallet available)
    const injected = connectors.find(c => c.id === 'injected' || c.id === 'metaMaskSDK') || connectors[0];

    return (
      <button
        onClick={() => injected && connect({ connector: injected })}
        disabled={isPending || !injected}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #ff4d8d 0%, #8b5cf6 100%)',
          border: 'none',
          color: 'white',
          fontSize: 13,
          fontWeight: 600,
          cursor: isPending ? 'wait' : 'pointer',
          boxShadow: '0 4px 16px rgba(255, 77, 141, 0.3)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <WalletOutlined />
        <span>{isPending ? '连接中...' : '连接钱包'}</span>
      </button>
    );
  }

  const meta = CHAIN_META[chainId] || { name: `Chain ${chainId}`, color: '#888', short: '?' };
  const wrongChain = !CHAIN_META[chainId];
  const symbol = balance?.symbol || 'ETH';

  const copy = () => {
    navigator.clipboard?.writeText(address);
    setCopied(true);
    message.success('地址已复制');
    setTimeout(() => setCopied(false), 1500);
  };

  const chainMenuItems = Object.entries(CHAIN_META).map(([id, m]) => ({
    key: id,
    label: (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 10, height: 10, borderRadius: '50%',
          background: m.color, display: 'inline-block',
          boxShadow: chainId === Number(id) ? `0 0 8px ${m.color}` : 'none',
        }} />
        <span style={{ fontWeight: chainId === Number(id) ? 600 : 400 }}>{m.name}</span>
        {chainId === Number(id) && <CheckCircleFilled style={{ color: m.color }} />}
      </span>
    ),
    onClick: () => switchChain({ chainId: Number(id) }),
  }));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 6px 6px 12px',
        borderRadius: 14,
        background: 'var(--bg-secondary)',
        border: `1px solid ${wrongChain ? '#ef4444' : 'var(--border-color)'}`,
        boxShadow: 'var(--shadow-card)',
        fontSize: 13,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Chain selector */}
      <Dropdown
        menu={{ items: chainMenuItems }}
        trigger={['click']}
        placement="bottomRight"
      >
        <Tooltip title="切换网络">
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 8px',
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              cursor: switching ? 'wait' : 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: meta.color,
              boxShadow: `0 0 6px ${meta.color}`,
            }} />
            <span>{meta.short}</span>
            <DownOutlined style={{ fontSize: 9, opacity: 0.6 }} />
          </button>
        </Tooltip>
      </Dropdown>

      {/* Balance */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 4,
        padding: '0 8px',
        borderLeft: '1px solid var(--border-color)',
        borderRight: '1px solid var(--border-color)',
      }}>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>
          {shortBalance(balance)}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
          {symbol}
        </span>
      </div>

      {/* Address */}
      <Tooltip title={copied ? '已复制!' : '复制地址'}>
        <button
          onClick={copy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: 12,
            fontFamily: 'monospace',
          }}
        >
          {copied ? <CheckCircleFilled style={{ color: '#10b981' }} /> : <WalletOutlined />}
          <span>{shortAddr(address)}</span>
        </button>
      </Tooltip>

      {/* Disconnect */}
      <Tooltip title="断开连接">
        <button
          onClick={() => disconnect()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <DisconnectOutlined />
        </button>
      </Tooltip>
    </div>
  );
}
