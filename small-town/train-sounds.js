export function createTrainSounds() {
  let context = null;
  let master = null;
  const buffers = {};
  const active = new Map();

  function stop(entry) {
    entry.loop?.stop();
    entry.horn?.stop();
    entry.gain?.disconnect();
  }

  return {
    init(audioContext) {
      context = audioContext;
      master = context.createGain();
      master.gain.value = 0;
      master.connect(context.destination);
      for (const name of ['train', 'fast', 'slow']) {
        fetch(`assets/sound/${name}.mp3`)
          .then(response => {
            if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
            return response.arrayBuffer();
          })
          .then(data => context.decodeAudioData(data))
          .then(buffer => { buffers[name] = buffer; })
          .catch(error => console.warn('火車音效載入失敗', error));
      }
    },
    update(trains, dt, enabled, accelerated = false) {
      if (!context) return;
      if (enabled) master.gain.setTargetAtTime(0.25, context.currentTime, 0.03);
      else {
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setValueAtTime(0, context.currentTime);
      }
      const live = new Set(trains.map(train => train.id));
      for (const [id, entry] of active) {
        if (!live.has(id)) {
          stop(entry);
          active.delete(id);
        }
      }
      for (const train of trains) {
        let entry = active.get(train.id);
        if (!entry) {
          entry = { delay: Math.random() * 12, hornPlayed: false };
          active.set(train.id, entry);
        }
        if (accelerated) {
          entry.hornPlayed = true;
          entry.horn?.stop();
          entry.horn = null;
        }
        if (enabled) entry.delay -= dt;
        if (enabled && !entry.hornPlayed && entry.delay <= 0 && buffers.train) {
          entry.hornPlayed = true;
          entry.horn = context.createBufferSource();
          entry.horn.buffer = buffers.train;
          entry.horn.connect(master);
          entry.horn.start();
        }
        if (!entry.loop && enabled && train.movement > 0 && buffers[train.kind]) {
          entry.gain = context.createGain();
          entry.gain.gain.value = 0;
          entry.gain.connect(master);
          entry.loop = context.createBufferSource();
          entry.loop.buffer = buffers[train.kind];
          entry.loop.loop = true;
          entry.loop.connect(entry.gain);
          entry.loop.start();
        }
        entry.gain?.gain.setTargetAtTime(train.movement, context.currentTime, 0.15);
      }
    },
    dispose() {
      for (const entry of active.values()) stop(entry);
      active.clear();
      master?.disconnect();
    },
  };
}
