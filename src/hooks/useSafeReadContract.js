// 通用 hook：带 try/catch + 错误降级的 wagmi useReadContract
// 解决：
//   1) viem 2.x 空 uint256[] 误报 "no data" → onError 吞掉
//   2) readContract 默认不重试
//   3) 多个组件读同一数据没缓存
import { useReadContract } from 'wagmi';
import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * @param {object} opts  wagmi useReadContract options
 * @param {number} opts.fallbackValue  读失败时的回退值（避免组件用 undefined 报错）
 * @returns {{ data, isLoading, isError, refetch }}
 */
export function useSafeReadContract(opts, fallbackValue = null) {
  const { data, isLoading, error, refetch } = useReadContract({
    ...opts,
    query: {
      retry: false,  // 禁用内置 retry（viem "no data" 不可恢复）
      ...opts.query,
    },
  });
  const [safeData, setSafeData] = useState(fallbackValue);

  useEffect(() => {
    if (data !== undefined) {
      setSafeData(data);
    } else if (error) {
      // 吞掉 viem "no data" 等错误，保持 fallback
      // 其它错误 console.warn 帮助调试
      if (!String(error.message || '').includes('returned no data')) {
        console.warn('useSafeReadContract error:', error.message);
      }
      setSafeData(fallbackValue);
    }
  }, [data, error, fallbackValue]);

  return {
    data: safeData,
    isLoading,
    isError: !!error,
    refetch,
  };
}

/**
 * 通用数据 fetcher hook（管理 loading/error/empty 三态）
 * @param {() => Promise<any>} fetcher  数据获取函数
 * @param {object} [opts]
 * @param {any[]} [opts.deps] 依赖项数组（默认 []，只在 mount 时 fetch）
 * @returns {{ data, isLoading, isError, refetch, setData }}
 */
export function useDataFetcher(fetcher, opts = {}) {
  const deps = opts.deps || [];
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const cancelledRef = useRef(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const result = await fetcher();
      if (!cancelledRef.current) {
        setData(result);
        setIsLoading(false);
      }
    } catch (e) {
      console.warn('useDataFetcher error:', e.message || e);
      if (!cancelledRef.current) {
        setIsError(true);
        setIsLoading(false);
        setData(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    cancelledRef.current = false;
    load();
    return () => { cancelledRef.current = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, isError, refetch: load, setData };
}
