let installed = false;

export function installNetworkMonitor() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  let count = 0;

  const setCount = (value: number) => {
    count = value;
    (window as typeof window & { __nuulNetworkCount?: number }).__nuulNetworkCount = count;
  };

  setCount(0);
  (window as typeof window & { __nuulNetworkStart?: number }).__nuulNetworkStart = Date.now();

  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    setCount(count + 1);
    return originalFetch(...args);
  };

  const OriginalXHR = window.XMLHttpRequest;
  const XHRProxy = function () {
    const xhr = new OriginalXHR();
    const originalSend = xhr.send;
    xhr.send = function (...sendArgs) {
      setCount(count + 1);
      return originalSend.apply(xhr, sendArgs as unknown as [Document | BodyInit | null | undefined]);
    };
    return xhr;
  } as unknown as typeof XMLHttpRequest;

  window.XMLHttpRequest = XHRProxy;
}

export function getNetworkCount() {
  if (typeof window === "undefined") return 0;
  return (window as typeof window & { __nuulNetworkCount?: number }).__nuulNetworkCount ?? 0;
}

export function getNetworkStart() {
  if (typeof window === "undefined") return null;
  return (window as typeof window & { __nuulNetworkStart?: number }).__nuulNetworkStart ?? null;
}
