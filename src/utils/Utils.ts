export class Utils {
  public static checkMemoryUsage(callback: () => void) {
    // @ts-ignore
    if (window.performance.memory) {
      // @ts-ignore
      const memoryUsage = performance.memory.usedJSHeapSize;

      // console.log(`Memory Usage: ${memoryUsage} bytes`);

      Utils.analyzeMemoryUsage(callback);
    }
  }

  public static analyzeMemoryUsage(callback: () => void) {
    // @ts-ignore
    if (performance.memory) {
      const { totalJSHeapSize, usedJSHeapSize, jsHeapSizeLimit } =
        // @ts-ignore
        performance.memory;
      // console.log(`Total JS Heap Size: ${totalJSHeapSize}`);
      // console.log(`Used JS Heap Size: ${usedJSHeapSize}`);
      // console.log(`JS Heap Size Limit: ${jsHeapSizeLimit}`);

      // 分析具体内容占比
      const usedPercentage = (usedJSHeapSize / totalJSHeapSize) * 100;
      // console.log(`Used JS Heap Percentage: ${usedPercentage.toFixed(2)}%`);

      // 如果使用超过一定比例，清除冗余内容
      if (usedPercentage > 80) {
        callback();
      }
    }
  }
}
