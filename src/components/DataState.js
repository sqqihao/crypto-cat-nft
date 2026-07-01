import React from 'react';
import { Skeleton, Empty, Result, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

/**
 * 三态数据展示组件：loading / error / empty / children
 * - loading: 显示 antd Skeleton
 * - error:   显示 antd Result error，提供重试按钮
 * - empty:   显示 antd Empty，可自定义 description
 * - 否则:    渲染 children(data)
 *
 * Props:
 *   isLoading, isError, data, refetch, emptyText, errorText
 *   children(data)  // 渲染函数
 */
export function DataState({
  isLoading = false,
  isError = false,
  data = null,
  refetch,
  emptyText = '暂无数据',
  errorText = '加载失败',
  children,
}) {
  if (isLoading) {
    return (
      <div style={{ padding: '24px 0' }}>
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }
  if (isError) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '24px',
        width: '100%',
      }}>
        <Result
          status="error"
          title={errorText}
          subTitle="请检查钱包连接 / 链 ID / 网络"
          extra={
            refetch && (
              <Button type="primary" icon={<ReloadOutlined />} onClick={refetch}>
                重试
              </Button>
            )
          }
        />
      </div>
    );
  }
  // data 为空数组 / null / undefined
  const isEmpty = data == null
    || (Array.isArray(data) && data.length === 0)
    || (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0);
  if (isEmpty) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '24px',
        width: '100%',
      }}>
        <Empty description={emptyText} />
      </div>
    );
  }
  return typeof children === 'function' ? children(data) : children;
}

/**
 * 内联 loading 状态（用于按钮/卡片内的 spinner 文字）
 */
export function InlineLoading({ isLoading, children, fallback = '加载中...' }) {
  return isLoading ? <span style={{ opacity: 0.6 }}>{fallback}</span> : children;
}
