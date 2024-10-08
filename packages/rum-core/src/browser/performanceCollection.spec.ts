import { registerCleanupTask } from '@datadog/browser-core/test'
import { createPerformanceEntry, mockPerformanceObserver, mockRumConfiguration } from '../../test'
import { LifeCycle, LifeCycleEventType } from '../domain/lifeCycle'
import { startPerformanceCollection } from './performanceCollection'
import { RumPerformanceEntryType } from './performanceObservable'

describe('startPerformanceCollection', () => {
  const lifeCycle = new LifeCycle()
  let entryCollectedCallback: jasmine.Spy

  function setupStartPerformanceCollection() {
    entryCollectedCallback = jasmine.createSpy()
    const { stop } = startPerformanceCollection(lifeCycle, mockRumConfiguration())
    const subscription = lifeCycle.subscribe(LifeCycleEventType.PERFORMANCE_ENTRIES_COLLECTED, entryCollectedCallback)

    registerCleanupTask(() => {
      stop()
      subscription.unsubscribe()
    })
  }

  ;[RumPerformanceEntryType.LAYOUT_SHIFT].forEach((entryType) => {
    it(`should notify ${entryType}`, () => {
      const { notifyPerformanceEntries } = mockPerformanceObserver()
      setupStartPerformanceCollection()

      notifyPerformanceEntries([createPerformanceEntry(entryType)])

      expect(entryCollectedCallback).toHaveBeenCalledWith([jasmine.objectContaining({ entryType })])
    })
  })
  ;[
    RumPerformanceEntryType.NAVIGATION,
    RumPerformanceEntryType.RESOURCE,
    RumPerformanceEntryType.LONG_TASK,
    RumPerformanceEntryType.LARGEST_CONTENTFUL_PAINT,
    RumPerformanceEntryType.PAINT,
    RumPerformanceEntryType.FIRST_INPUT,
    RumPerformanceEntryType.EVENT,
  ].forEach((entryType) => {
    it(`should not notify ${entryType} timings`, () => {
      const { notifyPerformanceEntries } = mockPerformanceObserver()
      setupStartPerformanceCollection()

      notifyPerformanceEntries([createPerformanceEntry(entryType)])

      expect(entryCollectedCallback).not.toHaveBeenCalled()
    })
  })

  it('should handle exceptions coming from performance observer .observe()', () => {
    const { notifyPerformanceEntries } = mockPerformanceObserver({
      emulateAllEntryTypesUnsupported: true,
    })
    setupStartPerformanceCollection()

    expect(() => notifyPerformanceEntries([createPerformanceEntry(RumPerformanceEntryType.RESOURCE)])).not.toThrow()

    expect(entryCollectedCallback).not.toHaveBeenCalled()
  })
})
