import test from 'node:test';
import assert from 'node:assert/strict';
import { mediaUrl, escapeText, portraitMarkup, videoMarkup } from '../src/media.js';

test('empty or invalid media never create empty public sections', () => {
  assert.equal(portraitMarkup({ src: '' }), '');
  assert.equal(videoMarkup({ src: '' }), '');
  for (const url of ['javascript:alert(1)', '//other.example/test', 'data:text/html,test', '/\\other.example/test', 'https://user:password@example.com/v.mp4']) {
    assert.equal(mediaUrl(url), '');
  }
});

test('portrait preserves a supplied local original and escapes its attributes', () => {
  const html = portraitMarkup({ src: '/images/vinicius.webp', alt: 'Vinícius "EFM"', caption: '<EFM>' });
  assert.match(html, /src="\/images\/vinicius.webp"/);
  assert.match(html, /Vinícius &quot;EFM&quot;/);
  assert.match(html, /&lt;EFM&gt;/);
  assert.doesNotMatch(html, /<EFM>/);
  assert.equal(escapeText("<&'"), '&lt;&amp;&#39;');
});

test('offline preview accepts embedded image data without enabling arbitrary data URLs', () => {
  const embedded = 'data:image/webp;base64,UklGRg==';
  assert.equal(mediaUrl(embedded), embedded);
  assert.match(portraitMarkup({ src: embedded, alt: 'Malta' }), /data:image\/webp;base64,UklGRg==/);
  assert.equal(mediaUrl('data:text/html;base64,PHNjcmlwdD4='), '');
  assert.equal(mediaUrl('data:image/webp,not-base64'), '');
});

test('optional video is user-controlled, lazy and supports a captions track', () => {
  const html = videoMarkup({ src: '/videos/campaign.mp4', poster: '/images/video.webp', captions: '/videos/campaign.vtt', title: 'Vinícius apresenta' });
  assert.match(html, /controls playsinline preload="none"/);
  assert.match(html, /kind="captions"/);
  assert.match(html, /poster="\/images\/video.webp"/);
  assert.doesNotMatch(html, /autoplay/);
  assert.match(html, /href="#seu-plano"/);
});
