import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAudioManager, normalizeAudioSettings, sceneMusic } from './audio.js';

function harness(settings = {}, config = {}) {
  let time = 0;
  const elements = [];
  const timers = new Map();
  let timerId = 0;
  class FakeAudio {
    constructor() { this.paused = true; this.ended = false; this.volume = 1; this.currentTime = 0; this.handlers = new Map(); this.plays = 0; elements.push(this); }
    play() { this.plays++; if (this.reject) return Promise.reject(new Error('No audio')); this.paused = false; return Promise.resolve(); }
    pause() { this.paused = true; }
    addEventListener(name, fn) { this.handlers.set(name, fn); }
    removeEventListener(name) { this.handlers.delete(name); }
    removeAttribute(name) { if (name === 'src') this.src = ''; }
    error() { this.handlers.get('error')?.(); }
  }
  const handlers = new Map();
  const document = {
    hidden: false,
    addEventListener(name, fn) { handlers.set(name, fn); },
    removeEventListener(name) { handlers.delete(name); },
  };
  const assets = ['music-settlement', 'music-campaign', 'music-boss', 'music-legacy', 'sfx-click', 'sfx-crit', 'sfx-build', 'sfx-victory', 'sfx-research'].map(id => ({ id, path: `assets/${id}.mp3` }));
  const manager = createAudioManager({ assets, settings, AudioClass: FakeAudio, document, now: () => time, setInterval(fn) { timers.set(++timerId, fn); return timerId; }, clearInterval(id) { timers.delete(id); }, ...config });
  return {
    manager, elements, timers,
    advance(ms) { time += ms; for (const fn of [...timers.values()]) fn(); },
    hide(value) { document.hidden = value; handlers.get('visibilitychange')?.(); },
    get listening() { return handlers.size; },
  };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };

test('legacy sound setting migrates while music remains off by default', () => {
  assert.equal(normalizeAudioSettings({ sound: true }).effectsEnabled, true);
  assert.equal(normalizeAudioSettings({ sound: false }).effectsEnabled, false);
  assert.equal(normalizeAudioSettings({ sound: true }).musicEnabled, false);
  assert.equal(normalizeAudioSettings({ effectsEnabled: false, sound: true }).effectsEnabled, false);
  assert.equal(normalizeAudioSettings({ musicVolume: 4, effectsVolume: -1 }).musicVolume, 1);
  assert.equal(normalizeAudioSettings({ musicVolume: 4, effectsVolume: -1 }).effectsVolume, 0);
  assert.equal(normalizeAudioSettings({ musicVolume: NaN }).musicVolume, .32);
});

test('saved music preference never autoplays or downloads before explicit music gesture', async () => {
  const h = harness({ musicEnabled: true, sound: true });
  h.manager.setScene('campaign');
  h.manager.unlock();
  await flush();
  assert.equal(h.elements.length, 0);
  h.manager.enableMusic(true);
  await flush();
  assert.equal(h.elements.length, 1);
  assert.equal(h.elements[0].paused, false);
  assert.equal(h.elements[0].src, 'assets/music-campaign.mp3');
});

test('music follows views and boss frontier; transitions use only two players', async () => {
  assert.equal(sceneMusic('campaign', true), 'music-boss');
  assert.equal(sceneMusic('legacy'), 'music-legacy');
  assert.equal(sceneMusic('journal'), 'music-legacy');
  assert.equal(sceneMusic('expeditions'), 'music-campaign');
  assert.equal(sceneMusic('heroes'), 'music-settlement');
  const h = harness({ musicVolume: .4 });
  h.manager.enableMusic(true); await flush();
  h.manager.setScene('campaign'); await flush();
  assert.equal(h.elements[1].volume, 0);
  h.advance(450);
  assert.equal(h.elements[0].volume, .2);
  assert.equal(h.elements[1].volume, .2);
  h.advance(450);
  assert.equal(h.elements[0].paused, true);
  assert.equal(h.elements[1].volume, .4);
  h.manager.setScene('campaign', true); await flush(); h.advance(1000);
  assert.equal(h.elements.length, 2);
  assert.equal(h.elements[0].src, 'assets/music-boss.mp3');
  assert.equal(h.timers.size, 0);
});

test('clicks and critical clicks share limiter; effects have a bounded player pool', async () => {
  const h = harness({ sound: true }, { effectVoices: 2 });
  assert.equal(h.manager.playSfx('click'), false);
  h.manager.unlock();
  assert.equal(h.manager.playSfx('click'), true);
  assert.equal(h.manager.playSfx('crit'), false);
  h.advance(90);
  assert.equal(h.manager.playSfx('crit'), true);
  h.advance(90);
  assert.equal(h.manager.playSfx('build'), false);
  assert.equal(h.elements.length, 2);
  h.elements[0].pause();
  h.advance(100);
  assert.equal(h.manager.playSfx('build'), true);
  assert.equal(h.elements.length, 2);
  await flush();
});

test('hidden page pauses all audio and only previously enabled music resumes', async () => {
  const h = harness({ sound: true });
  h.manager.enableMusic(true); await flush();
  h.manager.playSfx('build');
  h.hide(true); await flush();
  assert(h.elements.every(e => e.paused));
  assert.equal(h.manager.playSfx('click'), false);
  h.hide(false); await flush();
  assert.equal(h.elements[0].paused, false);
  assert.equal(h.elements[1].paused, true);
  h.manager.enableMusic(false);
  h.hide(true); h.hide(false); await flush();
  assert(h.elements.every(e => e.paused));
});

test('volume controls and effects mute apply independently', async () => {
  const h = harness({ sound: true });
  h.manager.enableMusic(true); await flush();
  h.manager.playSfx('build');
  h.manager.setVolumes({ music: .7, effects: .2 });
  assert.equal(h.elements[0].volume, .7);
  assert.equal(h.elements[1].volume, .2);
  h.manager.setEffects(false);
  assert.equal(h.elements[1].paused, true);
  assert.equal(h.elements[0].paused, false);
  assert.equal(h.manager.playSfx('victory'), false);
  assert.equal(h.manager.getSettings().effectsEnabled, false);
});

test('missing and failed audio are silent, rejected play promises are handled', async () => {
  const h = harness({ sound: true });
  h.manager.unlock();
  assert.equal(h.manager.playSfx('unknown'), false);
  h.manager.playSfx('click');
  h.elements[0].error(); h.advance(100);
  assert.equal(h.manager.playSfx('click'), false);
  h.elements[0].reject = true;
  assert.equal(h.manager.playSfx('build'), true);
  await flush();
  assert.equal(h.elements[0].paused, true);
  h.manager.destroy();
  assert.equal(h.listening, 0);
  assert.equal(h.manager.playSfx('victory'), false);
});

test('music disabled during pending playback never restarts', async () => {
  const h = harness();
  h.manager.enableMusic(true);
  h.manager.enableMusic(false);
  await flush();
  assert(h.elements.every(e => e.paused));
  assert.equal(h.timers.size, 0);
});

test('rapid scene changes cannot let an old play promise pause the current reused player', async () => {
  const h = harness();
  h.manager.enableMusic(true);
  h.manager.setScene('campaign');
  h.manager.setScene('legacy');
  await flush();
  assert.equal(h.elements.length, 2);
  assert.equal(h.elements[0].src, 'assets/music-legacy.mp3');
  assert.equal(h.elements[0].paused, false);
  assert.equal(h.elements[1].paused, true);
});
