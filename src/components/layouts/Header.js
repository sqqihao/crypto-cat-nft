import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layout, Menu, Drawer, Button, Space, Typography, Modal, Grid } from 'antd';
import { SettingOutlined, MenuOutlined, CloseOutlined, QuestionCircleOutlined, HomeOutlined, ShopOutlined, ExperimentOutlined, HeartOutlined, ToolOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';
import { useTheme } from "../../themes/ThemeContext.js";
import WalletCard from "../wallet/WalletCard.js";

const { Header: AntHeader } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

function _Header() {
	const { theme } = useTheme();
	const { isConnected } = useAccount();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [helpOpen, setHelpOpen] = useState(false);
	const screens = useBreakpoint();
	const location = useLocation();

	// 移动端 = < 768px（antd 默认 md 断点）
	const isMobile = !screens.md;

	// 当前路由 → 菜单 selected key（HashRouter 路由是 "/list" "/marketplace" 等）
	const selectedKey = location.pathname || '/';

	// 路由跳转并关闭 drawer
	const go = (path) => () => {
		window.location.hash = path;
		setDrawerOpen(false);
	};

	// Esc 键关闭 drawer
	useEffect(() => {
		const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
		if (drawerOpen) window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [drawerOpen]);

	// 锁 body scroll when drawer open
	useEffect(() => {
		if (drawerOpen) {
			document.body.style.overflow = 'hidden';
			return () => { document.body.style.overflow = ''; };
		}
	}, [drawerOpen]);

	const items = [
		{ key: '/list', label: '我的猫', icon: <HeartOutlined />, onClick: go('/list') },
		{ key: '/breed', label: '哺育小猫', icon: <ExperimentOutlined />, onClick: go('/breed') },
		{ key: '/marketplace', label: '市场', icon: <ShopOutlined />, onClick: go('/marketplace') },
		{ key: '/factory', label: '工厂', icon: <ToolOutlined />, onClick: go('/factory') },
		{ key: '/settings', label: '设置', icon: <SettingOutlined />, onClick: go('/settings') },
	];

	// 桌面端 Menu（横向）
	const desktopMenuItems = items.map(i => ({
		key: i.key,
		label: i.label,
		icon: i.icon,
		onClick: i.onClick,
	}));

	// 移动端 Drawer Menu（竖向）
	const mobileMenuItems = items.map(i => ({
		key: i.key,
		label: <span style={{ fontSize: 16, fontWeight: 500 }}>{i.label}</span>,
		icon: <span style={{ fontSize: 18 }}>{i.icon}</span>,
		onClick: i.onClick,
	}));

	return (
		<>
			<AntHeader style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: isMobile ? '0 12px' : '0 24px',
				background: 'var(--bg-secondary)',
				borderBottom: '1px solid var(--border-color)',
				boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
				position: 'sticky',
				top: 0,
				zIndex: 100,
				backdropFilter: 'blur(12px)',
				height: isMobile ? 56 : 64,
			}}>
				<Space size="middle" align="center" style={{ height: '100%', lineHeight: isMobile ? '56px' : '64px' }}>
					<div style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: isMobile ? 36 : 44,
						height: isMobile ? 36 : 44,
						borderRadius: 12,
						background: 'linear-gradient(135deg, #ff4d8d 0%, #8b5cf6 100%)',
						boxShadow: '0 4px 12px rgba(255, 77, 141, 0.3)',
						fontSize: isMobile ? 20 : 24,
						cursor: 'pointer',
					}} onClick={go('/')}>
						🐱
					</div>
					{!isMobile && (
						<Text strong style={{
							fontSize: 18,
							background: 'linear-gradient(90deg, #ff4d8d, #8b5cf6)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							cursor: 'pointer',
						}} onClick={go('/')}>
							CryptoCat
						</Text>
					)}
				</Space>

				{/* 桌面端菜单 */}
				{!isMobile && (
					<div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
						<Menu
							mode="horizontal"
							selectedKeys={[selectedKey]}
							items={desktopMenuItems}
							style={{
								minWidth: 0,
								background: 'transparent',
								border: 'none',
								justifyContent: 'center',
							}}
						/>
					</div>
				)}

				<Space size="small">
					{!isConnected && (
						<Button
							type="text"
							icon={<QuestionCircleOutlined />}
							onClick={() => setHelpOpen(true)}
							style={{ color: 'var(--text-secondary)' }}
						/>
					)}
					<WalletCard />
					{/* 移动端汉堡按钮 */}
					{isMobile && (
						<Button
							type="text"
							icon={<MenuOutlined style={{ fontSize: 20 }} />}
							onClick={() => setDrawerOpen(true)}
							aria-label="open menu"
							style={{ color: 'var(--text-primary)' }}
						/>
					)}
				</Space>
			</AntHeader>

			{/* 移动端 Drawer */}
			<Drawer
				title={
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<Space>
							<div style={{
								width: 32, height: 32, borderRadius: 8,
								background: 'linear-gradient(135deg, #ff4d8d 0%, #8b5cf6 100%)',
								display: 'flex', alignItems: 'center', justifyContent: 'center',
								fontSize: 18,
							}}>🐱</div>
							<Text strong style={{
								fontSize: 16,
								background: 'linear-gradient(90deg, #ff4d8d, #8b5cf6)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
							}}>CryptoCat</Text>
						</Space>
						<Button
							type="text"
							icon={<CloseOutlined />}
							onClick={() => setDrawerOpen(false)}
							aria-label="close menu"
						/>
					</div>
				}
				placement="right"
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				width="80%"
				styles={{ body: { padding: 0 } }}
				closable={false}
			>
			<Menu
				mode="vertical"
				selectedKeys={[selectedKey]}
				items={mobileMenuItems}
				style={{ borderRight: 0, padding: '8px 0' }}
			/>
				<div style={{
					padding: '16px 24px',
					borderTop: '1px solid var(--border-color)',
					marginTop: 16,
				}}>
					<Space direction="vertical" size="small" style={{ width: '100%' }}>
						<Button
							icon={<QuestionCircleOutlined />}
							block
							onClick={() => { setHelpOpen(true); setDrawerOpen(false); }}
						>
							连接钱包帮助
						</Button>
						<div style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 8 }}>
							Crypto Cat NFT © 2026
						</div>
					</Space>
				</div>
			</Drawer>

			{/* Help modal */}
			<Modal
				title="💡 如何连接钱包？"
				open={helpOpen}
				onCancel={() => setHelpOpen(false)}
				footer={null}
				centered
				width={isMobile ? '90%' : 520}
			>
				<Space direction="vertical" size="middle" style={{ width: '100%' }}>
					<div>
						<Text strong>1. 安装 MetaMask</Text>
						<div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
							访问 metamask.io 下载浏览器扩展
						</div>
					</div>
					<div>
						<Text strong>2. 添加 Hardhat Local 网络</Text>
						<div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
							网络名：Hardhat Local · RPC：http://127.0.0.1:8545 · Chain ID：31337
						</div>
					</div>
					<div>
						<Text strong>3. 导入测试账户</Text>
						<div style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 4, fontFamily: 'monospace', wordBreak: 'break-all' }}>
							0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
						</div>
					</div>
					<div>
						<Text strong>4. 点击 Connect Wallet</Text>
						<div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
							选择 MetaMask 并批准连接
						</div>
					</div>
				</Space>
			</Modal>
		</>
	);
}

export default _Header;
