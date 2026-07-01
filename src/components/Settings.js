import React from 'react';
import { Card, Row, Col, Typography, Radio, Space, Divider, Tag } from "antd";
import { BgColorsOutlined, CheckCircleFilled, RocketOutlined } from "@ant-design/icons";
import { useTheme } from "../themes/ThemeContext.js";
import { themeList } from "../themes/index.js";

const { Title, Paragraph, Text } = Typography;

function Settings() {
  const { themeId, setThemeId, theme } = useTheme();

  // Theme preview swatches per theme
  const swatches = {
    cyberpunk: ['#0a0118', '#ff4d8d', '#8b5cf6', '#22d3ee'],
    modern:    ['#ffffff', '#6366f1', '#0f172a', '#06b6d4'],
    cartoon:   ['#fff5fa', '#f472b6', '#a78bfa', '#fbbf24'],
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <Title level={2} style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
        <BgColorsOutlined /> 设置
      </Title>
      <Paragraph style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
        个性化你的 Crypto Cat 体验。设置自动保存到本地。
      </Paragraph>

      <Card
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 18,
          boxShadow: 'var(--shadow-card)',
        }}
        styles={{ body: { padding: 28 } }}
      >
        <Title level={4} style={{ color: 'var(--text-primary)', marginTop: 0 }}>
          主题
        </Title>
        <Paragraph style={{ color: 'var(--text-secondary)' }}>
          选择适合你的视觉风格。切换后立即生效。
        </Paragraph>

        <Radio.Group
          value={themeId}
          onChange={e => setThemeId(e.target.value)}
          style={{ width: '100%' }}
        >
          <Row gutter={[20, 20]}>
            {themeList.map(t => (
              <Col xs={24} md={8} key={t.id}>
                <Radio.Button
                  value={t.id}
                  style={{
                    width: '100%',
                    height: 'auto',
                    padding: 0,
                    background: t.id === themeId ? 'var(--bg-secondary)' : 'transparent',
                    border: t.id === themeId
                      ? '2px solid var(--accent-pink)'
                      : '1px solid var(--border-color)',
                    borderRadius: 16,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: 20 }}>
                    <Space size="small" style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: 24 }}>{t.icon}</span>
                      <Text strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>
                        {t.name}
                      </Text>
                      {t.id === themeId && (
                        <CheckCircleFilled style={{ color: 'var(--accent-pink)' }} />
                      )}
                    </Space>
                    {/* Preview area */}
                    <div style={{
                      height: 100,
                      background: t.bgImage,
                      borderRadius: 10,
                      border: '1px solid var(--border-color)',
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${swatches[t.id][1]} 0%, ${swatches[t.id][2]} 100%)`,
                        boxShadow: `0 4px 16px ${swatches[t.id][1]}55`,
                      }} />
                    </div>
                    {/* Color swatches */}
                    <Space size={6}>
                      {swatches[t.id].map((c, i) => (
                        <div key={i} style={{
                          width: 24, height: 24, borderRadius: 6,
                          background: c, border: '1px solid var(--border-color)',
                        }} />
                      ))}
                    </Space>
                    <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-secondary)' }}>
                      {t.id === 'cyberpunk' && '深色霓虹 · 适合夜晚 · 加密圈'}
                      {t.id === 'modern' && '极简白 · 适合专业用户 · 正式'}
                      {t.id === 'cartoon' && '可爱粉紫 · 适合休闲 · 玩票'}
                    </div>
                  </div>
                </Radio.Button>
              </Col>
            ))}
          </Row>
        </Radio.Group>
      </Card>

      <Divider style={{ borderColor: 'var(--border-color)' }} />

      <Card
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 18,
          boxShadow: 'var(--shadow-card)',
        }}
        styles={{ body: { padding: 28 } }}
      >
        <Title level={4} style={{ color: 'var(--text-primary)', marginTop: 0 }}>
          <RocketOutlined /> 链信息
        </Title>
        <Paragraph style={{ color: 'var(--text-secondary)' }}>
          当前支持的网络。
        </Paragraph>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ background: 'transparent', border: '1px solid var(--border-color)' }}>
              <Space direction="vertical" size={4}>
                <Text strong style={{ color: 'var(--text-primary)' }}>Hardhat Local</Text>
                <Tag color="purple">Chain ID 31337</Tag>
                <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>http://127.0.0.1:8545</Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ background: 'transparent', border: '1px solid var(--border-color)' }}>
              <Space direction="vertical" size={4}>
                <Text strong style={{ color: 'var(--text-primary)' }}>Sepolia 测试网</Text>
                <Tag color="cyan">Chain ID 11155111</Tag>
                <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>publicnode RPC</Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default Settings;
