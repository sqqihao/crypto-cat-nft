import React from 'react';
import { Result, Button, Space, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      const showDetails = import.meta.env.DEV;
      return (
        <div style={{ padding: '48px 24px', minHeight: '100vh', background: '#0e0a18' }}>
          <Result
            status="error"
            title={
              <span style={{ color: '#ef4444', fontSize: 28, fontWeight: 700 }}>
                😿 出错了
              </span>
            }
            subTitle={
              <span style={{ color: '#9ca3af', fontSize: 15 }}>
                应用遇到了意外错误。请刷新页面或重新连接钱包重试。
              </span>
            }
            extra={[
              <Button
                key="reload"
                type="primary"
                size="large"
                icon={<ReloadOutlined />}
                onClick={() => window.location.reload()}
                style={{
                  background: 'linear-gradient(135deg, #ff4d8d 0%, #8b5cf6 100%)',
                  border: 'none',
                  height: 48,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 12,
                }}
              >
                刷新页面
              </Button>,
            ]}
          />
          {showDetails && this.state.error && (
            <div style={{
              maxWidth: 800, margin: '24px auto',
              background: '#1a1a2e', borderRadius: 12,
              padding: 16,
            }}>
              <Text strong style={{ color: '#ef4444' }}>
                {this.state.error.toString()}
              </Text>
              {this.state.errorInfo && (
                <div style={{
                  marginTop: 12, padding: 12,
                  background: '#0e0a18', borderRadius: 8,
                  fontFamily: 'monospace', fontSize: 12,
                  color: '#9ca3af',
                  maxHeight: 300, overflow: 'auto',
                }}>
                  {this.state.errorInfo.componentStack}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
