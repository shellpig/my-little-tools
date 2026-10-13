// Music lives outside the game clock and saves only listening preferences.
export function createMusicPlayer() {
  const $ = id => document.getElementById(id);
  const panel = $('music-panel');
  const toggle = $('music');
  const audio = $('music-audio');
  const play = $('music-play');
  const seek = $('music-seek');
  const volume = $('music-volume');
  const files = $('music-files');
  const list = $('music-list');
  const status = $('music-status');
  const bgmModes = $('music-bgm-modes');
  const modeClock = $('music-mode-clock');
  const modeLoop = $('music-mode-loop');
  const bgmTracks = [
    { name: 'Sunny Station', cueHour: 6, cueTime: '06:00', url: 'assets/music/01-sunny-station.mp3' },
    { name: 'Station Breeze', cueHour: 12, cueTime: '12:00', url: 'assets/music/02-station-breeze.mp3' },
    { name: 'Sunset Station', cueHour: 18, cueTime: '18:00', url: 'assets/music/03-sunset-station.mp3' },
    { name: 'Moonlit Station', cueHour: 0, cueTime: '00:00', url: 'assets/music/04-moonlit-station.mp3' },
  ];
  let localTracks = [];
  let tracks = bgmTracks;
  let mode = 'bgm';
  let bgmMode = 'clock';
  let clockOn = true;
  let loopOn = [true, true, true, true];
  let index = 0;
  let playRequest = 0;
  let loading = false;
  let blockedAutoplay = false;
  let lastHours = null;
  let baseVolume = 0.35;
  const FADE = 3;

  try {
    const saved = JSON.parse(localStorage.getItem('small-town:music'));
    if (saved && Number.isFinite(saved.volume)) baseVolume = Math.max(0, Math.min(1, saved.volume));
    if (saved && (saved.bgmMode === 'clock' || saved.bgmMode === 'loop')) bgmMode = saved.bgmMode;
    if (saved && typeof saved.clockOn === 'boolean') clockOn = saved.clockOn;
    if (saved && Array.isArray(saved.loopOn) && saved.loopOn.length === 4) {
      loopOn = saved.loopOn.map(Boolean);
    }
  } catch { /* storage unavailable */ }
  volume.value = Math.round(baseVolume * 100);
  $('music-volume-value').textContent = `${volume.value}%`;

  function savePreferences() {
    try {
      localStorage.setItem('small-town:music', JSON.stringify({
        volume: baseVolume,
        bgmMode,
        clockOn,
        loopOn,
      }));
    } catch { /* storage unavailable */ }
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '--:--';
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  }

  function updateProgress() {
    const ready = Number.isFinite(audio.duration) && audio.duration > 0;
    seek.disabled = !ready;
    seek.max = ready ? audio.duration : 1;
    seek.value = ready ? audio.currentTime : 0;
    $('music-time').textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  }

  // Every track fades in over its first FADE seconds and out over its last.
  function applyFade() {
    const t = audio.currentTime;
    const edge = Number.isFinite(audio.duration) ? Math.min(t, audio.duration - t) : t;
    audio.volume = baseVolume * Math.max(0, Math.min(1, edge / FADE));
  }

  // Timed music the browser blocked starts on the first click or key press
  // outside the music panel (the panel's own ▶ already handles it).
  function resumeOnGesture(e) {
    if (e.target instanceof Element && e.target.closest('#music-panel')) return;
    removeEventListener('pointerdown', resumeOnGesture);
    removeEventListener('keydown', resumeOnGesture);
    if (blockedAutoplay && clockOn) {
      blockedAutoplay = false;
      start();
    }
  }

  function getPeriodTrackIndex(h) {
    if (h >= 6 && h < 12) return 0;
    if (h >= 12 && h < 18) return 1;
    if (h >= 18 && h < 24) return 2;
    return 3;
  }

  function getNextCue(h) {
    if (h < 6) return bgmTracks[0];
    if (h < 12) return bgmTracks[1];
    if (h < 18) return bgmTracks[2];
    return bgmTracks[3];
  }

  // The next ticked track going forward (step 1) or back (step -1), or -1 if none.
  function stepLoop(fromIndex, step = 1) {
    const n = bgmTracks.length;
    for (let offset = 1; offset <= n; offset++) {
      const candidate = (fromIndex + step * offset + n * n) % n;
      if (loopOn[candidate]) return candidate;
    }
    return -1;
  }

  function updateAudioLoop() {
    if (mode === 'local') {
      audio.loop = tracks.length === 1;
    } else if (bgmMode === 'loop') {
      audio.loop = loopOn.filter(Boolean).length === 1 && loopOn[index];
    } else {
      audio.loop = false;
    }
  }

  function updatePlay() {
    if (mode === 'bgm' && bgmMode === 'clock') {
      // Here the button switches timed music on and off rather than one track.
      play.textContent = clockOn && !blockedAutoplay ? '⏸ 關閉時段音樂' : '▶ 開啟時段音樂';
    } else {
      play.textContent = audio.paused && !loading ? '▶ 播放' : '⏸ 暫停';
    }
  }

  function updateStatus() {
    if (mode === 'bgm' && bgmMode === 'clock') {
      if (blockedAutoplay) {
        status.textContent = '點一下畫面開始時段音樂';
      } else if (audio.paused && !loading && clockOn) {
        const next = getNextCue(lastHours ?? 6);
        status.textContent = `下一首 ${next.cueTime} · ${next.name}`;
      } else if (audio.paused && !loading && !clockOn) {
        status.textContent = '';
      }
    } else if (mode === 'bgm' && bgmMode === 'loop') {
      if (!loopOn.some(Boolean)) {
        status.textContent = '請至少勾選一首';
      }
    }
  }

  async function start() {
    status.textContent = '';
    const request = ++playRequest;
    loading = true;
    updatePlay();
    try {
      const track = tracks[index];
      if (mode === 'bgm' && !track.blobUrl) {
        status.textContent = '載入音樂…';
        // A blob also permits seeking on static servers without range requests.
        if (!track.loading) track.loading = fetch(track.url).then(response => {
          if (!response.ok) throw new Error('BGM unavailable');
          return response.blob();
        }).then(blob => { track.blobUrl = URL.createObjectURL(blob); }).catch(error => {
          track.loading = null;
          throw error;
        });
        await track.loading;
      }
      if (request !== playRequest) return;
      if (mode === 'bgm' && audio.getAttribute('src') !== track.blobUrl) audio.src = track.blobUrl;
      status.textContent = '';
      await audio.play();
      blockedAutoplay = false;
    } catch (error) {
      if (request === playRequest && error.name !== 'AbortError') {
        if (mode === 'bgm' && bgmMode === 'clock' && error.name === 'NotAllowedError') {
          blockedAutoplay = true;
          status.textContent = '點一下畫面開始時段音樂';
          addEventListener('pointerdown', resumeOnGesture);
          addEventListener('keydown', resumeOnGesture);
        } else {
          status.textContent = error.name === 'NotAllowedError'
            ? '請再按一次播放。' : '無法播放這首音樂，請選擇其他檔案。';
        }
      }
    } finally {
      if (request === playRequest) {
        loading = false;
        updatePlay();
      }
    }
  }

  function renderList() {
    list.replaceChildren(...tracks.map((track, i) => {
      if (mode === 'bgm' && bgmMode === 'loop') {
        const item = document.createElement('div');
        item.className = 'music-item';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = loopOn[i];
        checkbox.setAttribute('aria-label', track.name);
        checkbox.addEventListener('change', () => {
          loopOn[i] = checkbox.checked;
          savePreferences();
          updateAudioLoop();
          if (!loopOn.some(Boolean)) {
            playRequest++;
            loading = false;
            audio.pause();
            status.textContent = '請至少勾選一首';
            updatePlay();
          } else if (status.textContent === '請至少勾選一首') {
            status.textContent = '';
          }
          const checkedCount = loopOn.filter(Boolean).length;
          $('music-prev').disabled = $('music-next').disabled = checkedCount < 2;
        });
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `${i + 1}. ${track.name}`;
        button.title = track.name;
        button.classList.toggle('on', i === index);
        button.setAttribute('aria-current', i === index ? 'true' : 'false');
        button.addEventListener('click', () => selectTrack(i, true));
        item.append(checkbox, button);
        return item;
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = mode === 'bgm' && bgmMode === 'clock'
        ? `${track.cueTime} · ${track.name}`
        : `${i + 1}. ${track.name}`;
      button.title = track.name;
      button.classList.toggle('on', i === index);
      button.setAttribute('aria-current', i === index ? 'true' : 'false');
      button.addEventListener('click', () => selectTrack(i, true));
      return button;
    }));
    $('music-title').textContent = tracks[index].name;
    if (mode === 'bgm') {
      $('music-prev').disabled = $('music-next').disabled = bgmMode === 'clock'
        ? true
        : loopOn.filter(Boolean).length < 2;
    } else {
      $('music-prev').disabled = $('music-next').disabled = localTracks.length < 2;
    }
    $('music-bgm').classList.toggle('on', mode === 'bgm');
    $('music-local').classList.toggle('on', mode === 'local');
    $('music-local').disabled = localTracks.length === 0;
    bgmModes.hidden = mode !== 'bgm';
    modeClock.classList.toggle('on', bgmMode === 'clock');
    modeLoop.classList.toggle('on', bgmMode === 'loop');
  }

  function selectTrack(next, autoplay = false) {
    playRequest++;
    loading = false;
    audio.pause();
    index = next;
    audio.src = tracks[index].blobUrl ?? tracks[index].url;
    audio.volume = 0;
    updateAudioLoop();
    status.textContent = '';
    updateProgress();
    updatePlay();
    renderList();
    if (autoplay) start();
    else updateStatus();
  }

  function switchMode(next) {
    if (mode === next) return;
    const wasPlaying = !audio.paused || loading;
    playRequest++;
    loading = false;
    audio.pause();
    mode = next;
    tracks = mode === 'bgm' ? bgmTracks : localTracks;
    updateAudioLoop();
    if (mode === 'bgm') {
      if (bgmMode === 'clock') {
        selectTrack(getPeriodTrackIndex(lastHours ?? 6), false);
      } else {
        const startIdx = Math.max(stepLoop(bgmTracks.length - 1), 0);
        selectTrack(startIdx, wasPlaying && loopOn.some(Boolean));
      }
    } else {
      selectTrack(0, wasPlaying);
    }
  }

  function switchBgmMode(next) {
    if (bgmMode === next) return;
    bgmMode = next;
    savePreferences();
    updateAudioLoop();
    if (bgmMode === 'clock') {
      playRequest++;
      loading = false;
      audio.pause();
      status.textContent = '';
      selectTrack(getPeriodTrackIndex(lastHours ?? 6), false);
    } else {
      status.textContent = '';
      selectTrack(Math.max(stepLoop(bgmTracks.length - 1), 0), false);
      if (!loopOn.some(Boolean)) {
        status.textContent = '請至少勾選一首';
      }
    }
  }

  function close() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('on');
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (!panel.hidden) return close();
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('on');
    play.focus();
  });
  toggle.addEventListener('keydown', e => e.stopPropagation());
  $('music-close').addEventListener('click', close);
  panel.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.code === 'Escape') close();
  });
  play.addEventListener('click', () => {
    if (mode === 'bgm' && bgmMode === 'clock') {
      if (blockedAutoplay) {
        blockedAutoplay = false;
        clockOn = true;
        savePreferences();
        const target = getPeriodTrackIndex(lastHours ?? 6);
        audio.currentTime = 0;
        selectTrack(target, true);
        return;
      }
      if (!audio.paused || loading) {
        playRequest++;
        loading = false;
        audio.pause();
        clockOn = false;
        savePreferences();
        updatePlay();
        updateStatus();
        return;
      }
      clockOn = !clockOn;
      savePreferences();
      updatePlay();
      updateStatus();
      return;
    }
    if (mode === 'bgm' && bgmMode === 'loop' && !loopOn.some(Boolean)) {
      status.textContent = '請至少勾選一首';
      return;
    }
    if (audio.paused && !loading) {
      if (mode === 'bgm' && bgmMode === 'loop' && !loopOn[index]) {
        const next = stepLoop(index);
        if (next !== -1) {
          selectTrack(next, true);
          return;
        }
      }
      if (audio.ended) audio.currentTime = 0;
      start();
    } else {
      playRequest++;
      loading = false;
      status.textContent = '';
      audio.pause();
      updatePlay();
    }
  });
  $('music-prev').addEventListener('click', () => {
    if (mode === 'bgm' && bgmMode === 'loop') {
      const prev = stepLoop(index, -1);
      if (prev !== -1) selectTrack(prev, !audio.paused);
      return;
    }
    if (mode === 'local') {
      selectTrack((index + tracks.length - 1) % tracks.length, !audio.paused);
    }
  });
  $('music-next').addEventListener('click', () => {
    if (mode === 'bgm' && bgmMode === 'loop') {
      const next = stepLoop(index);
      if (next !== -1) selectTrack(next, !audio.paused);
      return;
    }
    if (mode === 'local') {
      selectTrack((index + 1) % tracks.length, !audio.paused);
    }
  });
  $('music-bgm').addEventListener('click', () => switchMode('bgm'));
  $('music-local').addEventListener('click', () => switchMode('local'));
  modeClock.addEventListener('click', () => switchBgmMode('clock'));
  modeLoop.addEventListener('click', () => switchBgmMode('loop'));
  $('music-choose').addEventListener('click', () => files.click());
  files.addEventListener('change', () => {
    if (!files.files.length) return;
    const autoplay = !audio.paused || loading;
    const next = [...files.files].map(file => ({ name: file.name, url: URL.createObjectURL(file) }));
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    for (const track of localTracks) URL.revokeObjectURL(track.url);
    localTracks = next;
    tracks = localTracks;
    mode = 'local';
    files.value = '';
    updateAudioLoop();
    selectTrack(0, autoplay);
  });
  seek.addEventListener('input', () => { audio.currentTime = Number(seek.value); });
  volume.addEventListener('input', () => {
    baseVolume = Number(volume.value) / 100;
    applyFade();
    $('music-volume-value').textContent = `${volume.value}%`;
    savePreferences();
  });
  audio.addEventListener('play', () => {
    updatePlay();
    updateStatus();
  });
  audio.addEventListener('pause', () => {
    updatePlay();
    updateStatus();
  });
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('ended', () => {
    if (mode === 'local') {
      if (tracks.length > 1) {
        selectTrack((index + 1) % tracks.length, true);
      }
    } else if (bgmMode === 'loop') {
      const next = stepLoop(index);
      if (next !== -1) {
        selectTrack(next, true);
      } else {
        status.textContent = '請至少勾選一首';
        updatePlay();
      }
    } else {
      updatePlay();
      updateStatus();
    }
  });
  audio.addEventListener('error', () => {
    audio.pause();
    status.textContent = '無法播放這首音樂，請選擇其他檔案。';
  });
  window.addEventListener('pagehide', e => {
    if (!e.persisted) {
      for (const track of localTracks) URL.revokeObjectURL(track.url);
      for (const track of bgmTracks) if (track.blobUrl) URL.revokeObjectURL(track.blobUrl);
    }
  });

  function tick(hours, speed) {
    if (!audio.paused) applyFade();
    if (lastHours === null) {
      lastHours = hours;
      if (mode === 'bgm' && bgmMode === 'clock') {
        // A game that opens right on a cue (the 06:00 start) plays that track.
        const cue = bgmTracks.findIndex(track => Math.abs(hours - track.cueHour) < 1 / 60);
        if (cue !== -1 && clockOn) {
          selectTrack(cue, true);
        } else {
          index = getPeriodTrackIndex(hours);
          audio.src = tracks[index].blobUrl ?? tracks[index].url;
          renderList();
        }
      }
      updateStatus();
      return;
    }

    let delta = hours - lastHours;
    if (delta < 0) delta += 24;

    if (mode === 'bgm' && bgmMode === 'clock') {
      for (let i = 0; i < bgmTracks.length; i++) {
        const cueHour = bgmTracks[i].cueHour === 0 ? 24 : bgmTracks[i].cueHour;
        if (lastHours < cueHour && cueHour <= lastHours + delta) {
          if (speed === 60 && delta < 0.1) {
            if (clockOn) {
              selectTrack(i, true);
            }
          }
          break;
        }
      }
      updateStatus();
    }

    lastHours = hours;
  }

  selectTrack(0);
  return { tick };
}
