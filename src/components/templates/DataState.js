// 通用三态显示组件：loading / empty / error / success
import { Spin, Empty, Result, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

export function DataState({ isLoading, isError, isEmpty, onRetry, children, emptyText = '无数据', loadingText = '加载中...' }) {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Spin tip={loadingText} size="large">
          <div style={{ minHeight: 80 }} />
        </Spin>
      </div>
    );
  }
  if (isError) {
    return (
      <Result
        status="error"
        title="加载失败"
        subTitle="链上数据读取失败，请检查网络或合约地址"
        extra={onRetry && <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>重试</Button>}
      />
    );
  }
  if (isEmpty) {
    return <Empty description={emptyText} style={{ padding: '40px 0' }} />;
  }
  return children;
}
