/** Browser-only presentation audio. No game state, timers or outcomes live here. */
const clampVolume = (value, fallback) => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback;

export function normalizeAudioSettings(value = {}) {
  const old = value && typeof value === 'object' ? value : {};
  return {
    musicEnabled: old.musicEnabled === true,
    effectsEnabled: typeof old.effectsEnabled === 'boolean' ? old.effectsEnabled : old.sound === true,
    musicVolume: clampVolume(old.musicVolume, 0.32),
    effectsVolume: clampVolume(old.effectsVolume, 0.55),
  };
}

export function sceneMusic(view, isBoss = false) {
  if (view === 'legacy' || view === 'journal') return 'music-legacy';
  if (view === 'campaign') return isBoss ? 'music-boss' : 'music-campaign';
  if (view === 'expeditions') return 'music-campaign';
  return 'music-settlement';
}

/**
 * Nothing is downloaded or played on construction. Call unlock() from a click
 * for effects; only enableMusic(true) / unlock({music:true}) grants music access.
 * A saved musicEnabled flag alone can never start playback after a page load.
 */
export function createAudioManager({
  assets = [],
  settings = {},
  AudioClass = globalThis.Audio,
  document: doc = globalThis.document,
  now = () => globalThis.performance?.now?.() ?? Date.now(),
  setInterval: schedule = globalThis.setInterval,
  clearInterval: cancel = globalThis.clearInterval,
  fadeMs = 900,
  effectVoices = 6,
} = {}) {
  let options = normalizeAudioSettings(settings);
  const entries = Array.isArray(assets) ? assets : Array.isArray(assets.assets) ? assets.assets : Object.entries(assets).map(([id, data]) => ({ id, ...data }));
  const catalogue = new Map(entries.map(entry => [entry.id, entry]));
  const unavailable = new Set();
  const lastEffect = new Map();
  const music = [];
  const effects = [];
  const listeners = [];
  let effectsUnlocked = false;
  let musicUnlocked = false;
  let destroyed = false;
  let activeIndex = -1;
  let activeId = null;
  let desiredId = sceneMusic('settlement');
  let generation = 0;
  let fade = null;
  const hidden = () => doc?.hidden === true;

  function stopFade() {
    if (fade !== null) cancel(fade);
    fade = null;
  }

  function makeVoice(loop) {
    if (typeof AudioClass !== 'function') return null;
    try {
      const element = new AudioClass();
      element.preload = 'none';
      element.loop = loop;
      if (element.setAttribute && doc?.body?.append) {
        element.setAttribute('data-ash-audio', loop ? 'music' : 'effect');
        element.hidden = true;
        doc.body.append(element);
      }
      const failure = () => {
        if (element._ashPath) unavailable.add(element._ashPath);
        element.pause();
      };
      element.addEventListener?.('error', failure);
      listeners.push([element, 'error', failure]);
      return element;
    } catch {
      return null;
    }
  }

  function validPath(id) {
    const path = catalogue.get(id)?.path;
    return typeof path === 'string' && path.length > 0 && !unavailable.has(path) ? path : null;
  }

  function assignSource(element, path) {
    if (element._ashPath !== path) {
      element._ashPath = path;
      element.src = path;
    }
  }

  function safePlay(element) {
    try {
      return Promise.resolve(element.play()).then(() => true, () => false);
    } catch {
      return Promise.resolve(false);
    }
  }

  function pauseMusic() {
    generation++;
    stopFade();
    for (const element of music) element?.pause();
  }

  function updateMusic() {
    if (destroyed || !options.musicEnabled || !musicUnlocked || hidden()) return;
    const path = validPath(desiredId);
    if (!path) return;
    const active = music[activeIndex];
    if (activeId === desiredId && active?._ashPath === path) {
      if (active.paused) {
        active.volume = options.musicVolume;
        const token = ++generation;
        active._ashGeneration = token;
        safePlay(active).then(ok => {
          if (active._ashGeneration === token && (!ok || token !== generation || hidden())) active.pause();
        });
      }
      return;
    }

    stopFade();
    const oldIndex = activeIndex;
    const oldId = activeId;
    const old = music[oldIndex];
    const oldVolume = old?.volume ?? 0;
    const nextIndex = oldIndex === 0 ? 1 : 0;
    music[nextIndex] ??= makeVoice(true);
    const next = music[nextIndex];
    if (!next) return;
    next.pause();
    assignSource(next, path);
    try { next.currentTime = 0; } catch { /* Some browsers reject seeking before metadata. */ }
    const shouldFade = old && !old.paused && fadeMs > 0;
    next.volume = shouldFade ? 0 : options.musicVolume;
    activeIndex = nextIndex;
    activeId = desiredId;
    const token = ++generation;
    next._ashGeneration = token;

    safePlay(next).then(ok => {
      // A rapid third selection can reuse this player before an older play()
      // promise settles. Never pause or alter the newly assigned source.
      if (next._ashGeneration !== token) return;
      if (token !== generation || destroyed || hidden() || !options.musicEnabled) {
        next.pause();
        return;
      }
      if (!ok) {
        next.pause();
        activeIndex = oldIndex;
        activeId = oldId;
        if (old) old.volume = options.musicVolume;
        return;
      }
      if (!shouldFade) {
        old?.pause();
        next.volume = options.musicVolume;
        return;
      }
      const start = now();
      fade = schedule(() => {
        if (token !== generation || hidden()) { stopFade(); return; }
        const progress = Math.max(0, Math.min(1, (now() - start) / fadeMs));
        next.volume = options.musicVolume * progress;
        old.volume = oldVolume * (1 - progress);
        if (progress === 1) {
          old.pause();
          stopFade();
        }
      }, 40);
      fade?.unref?.();
    });
  }

  function visibilityChanged() {
    if (hidden()) {
      pauseMusic();
      for (const element of effects) element.pause();
    } else {
      updateMusic();
    }
  }
  doc?.addEventListener?.('visibilitychange', visibilityChanged);

  return {
    unlock({ music: allowMusic = false } = {}) {
      if (destroyed) return;
      effectsUnlocked = true;
      if (allowMusic) {
        musicUnlocked = true;
        options.musicEnabled = true;
        updateMusic();
      }
    },
    enableMusic(enabled) {
      options.musicEnabled = enabled === true;
      if (options.musicEnabled) {
        musicUnlocked = true;
        effectsUnlocked = true;
        updateMusic();
      } else {
        pauseMusic();
      }
    },
    setEffects(enabled) {
      options.effectsEnabled = enabled === true;
      if (!options.effectsEnabled) for (const element of effects) element.pause();
    },
    setVolumes({ music: musicVolume, effects: effectsVolume } = {}) {
      options.musicVolume = clampVolume(musicVolume, options.musicVolume);
      options.effectsVolume = clampVolume(effectsVolume, options.effectsVolume);
      if (fade === null && music[activeIndex]) music[activeIndex].volume = options.musicVolume;
      for (const element of effects) element.volume = options.effectsVolume;
    },
    setScene(view, isBoss = false) {
      desiredId = sceneMusic(view, isBoss);
      updateMusic();
    },
    playSfx(name) {
      if (destroyed || hidden() || !effectsUnlocked || !options.effectsEnabled || options.effectsVolume === 0) return false;
      const id = name.startsWith('sfx-') ? name : `sfx-${name}`;
      const path = validPath(id);
      if (!path) return false;
      // Click and critical-click share one limiter, so alternating them cannot make noise.
      const key = id === 'sfx-click' || id === 'sfx-crit' ? 'click' : id;
      const limit = key === 'click' ? 90 : 70;
      const time = now();
      if (time - (lastEffect.get(key) ?? -Infinity) < limit) return false;
      lastEffect.set(key, time);
      let element = effects.find(element => element.paused || element.ended);
      if (!element && effects.length < Math.max(1, Math.min(12, effectVoices))) {
        element = makeVoice(false);
        if (element) effects.push(element);
      }
      // Drop excess effects instead of creating an unbounded collection of players.
      if (!element) return false;
      assignSource(element, path);
      try { element.currentTime = 0; } catch { /* Metadata may not be available yet. */ }
      element.volume = options.effectsVolume;
      safePlay(element);
      return true;
    },
    getSettings() { return { ...options }; },
    destroy() {
      destroyed = true;
      pauseMusic();
      for (const element of [...music, ...effects]) {
        if (!element) continue;
        element.pause();
        element.removeAttribute?.('src');
        element.remove?.();
      }
      for (const [element, event, fn] of listeners) element.removeEventListener?.(event, fn);
      doc?.removeEventListener?.('visibilitychange', visibilityChanged);
    },
  };
}
