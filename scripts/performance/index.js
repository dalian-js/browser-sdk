const { runMain } = require('../lib/execution-utils')
const { reportAsPrComment } = require('./report-as-a-pr-comment')
const { reportToDatadog } = require('./report-to-datadog')
const { calculateBundleSizes } = require('./bundle-size/compute-bundle-size')
const { computeCpuPerformance } = require('./cpu-performance/compute-cpu-performance')
const { computeMemoryPerformance } = require('./memory-performance/compute-memory-performance')

runMain(async () => {
  const localBundleSizes = calculateBundleSizes()
  const localMemoryPerformance = await computeMemoryPerformance()
  await computeCpuPerformance()
  await reportToDatadog(localMemoryPerformance, 'memoryPerformance')
  await reportToDatadog(localBundleSizes, 'bundleSizes')
  await reportAsPrComment(localBundleSizes, localMemoryPerformance)
})
