import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { trackEvent, setAnalyticsConsent } from '../src/analytics.js';

const properties = { section: 'plans', language: 'spanish', plan: 'premium' };
const originalWindow = globalThis.window;
const originalCustomEvent = globalThis.CustomEvent;
let events;

beforeEach(() => {
  events = [];
  globalThis.window = {
    dispatchEvent: (event) => events.push(event),
    dataLayer: [],
  };
  globalThis.CustomEvent = class {
    constructor(type, options) { this.type = type; this.detail = options.detail; }
  };
  setAnalyticsConsent(false);
});

afterEach(() => {
  if (originalWindow === undefined) delete globalThis.window;
  else globalThis.window = originalWindow;
  if (originalCustomEvent === undefined) delete globalThis.CustomEvent;
  else globalThis.CustomEvent = originalCustomEvent;
  setAnalyticsConsent(false);
});

test('one explicit action emits one local intent event without consent or provider send', () => {
  assert.equal(trackEvent('whatsapp_click', properties), true);
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'efm:analytics');
  assert.deepEqual(events[0].detail, { event: 'whatsapp_click', ...properties });
  assert.deepEqual(window.dataLayer, []);
});

test('consent enables existing dataLayer; revocation stops writes without replay', () => {
  trackEvent('language_select', properties);
  setAnalyticsConsent(true);
  trackEvent('plan_select', properties);
  assert.deepEqual(window.dataLayer, [{ event: 'plan_select', ...properties }]);
  setAnalyticsConsent(false);
  trackEvent('whatsapp_click', properties);
  assert.equal(window.dataLayer.length, 1);
  assert.equal(events.length, 3);
});

test('truthy non-boolean consent is rejected', () => {
  setAnalyticsConsent('true');
  trackEvent('whatsapp_click', properties);
  assert.equal(window.dataLayer.length, 0);
});

test('invalid names, unknown IDs and free text never enter payloads', () => {
  for (const [name, props] of [
    ['enrollment_completed', properties],
    ['whatsapp_click', { ...properties, language: 'person@example.com' }],
    ['whatsapp_click', { ...properties, section: 'https://example.com/private' }],
    ['plan_select', { ...properties, plan: 'custom' }],
    ['whatsapp_click', {}],
    ['whatsapp_click', null],
  ]) assert.equal(trackEvent(name, props), false);
  assert.equal(events.length, 0);
  trackEvent('whatsapp_click', { ...properties, email: 'private@example.com', url: 'secret' });
  assert.deepEqual(Object.keys(events[0].detail), ['event', 'section', 'language', 'plan']);
});

test('no provider queue is created when none exists', () => {
  delete window.dataLayer;
  setAnalyticsConsent(true);
  assert.equal(trackEvent('whatsapp_click', properties), true);
  assert.equal('dataLayer' in window, false);
});

test('provider failures and absent browser cannot break the interaction', () => {
  window.dataLayer.push = () => { throw new Error('provider failure'); };
  window.dispatchEvent = () => { throw new Error('listener failure'); };
  setAnalyticsConsent(true);
  assert.doesNotThrow(() => trackEvent('whatsapp_click', properties));
  delete globalThis.window;
  assert.equal(trackEvent('whatsapp_click', properties), false);
});
