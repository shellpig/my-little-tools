// Music lives outside the game clock and saves only listening preferences.
export function createMusicPlayer() {
  const $ = id => document.getElementById(id);
  const panel = $('music-panel');
  const toggle = $('music');
  const audio = $('music-audio');
  const play = $('music-play');
  const seek = $('music-seek');
  const volume = $('music-volume');
  const repeat = $('music-repeat');
  const files = $('music-files');
  const list = $('music-list');
  const status = $('music-status');
  const bgmTracks = [
    { name: 'Sunny Station', url: 'assets/music/01-sunny-station.mp3' },
    { name: 'Station Breeze', url: 'assets/music/02-station-breeze.mp3' },
    { name: 'Sunset Station', url: 'assets/music/03-sunset-station.mp3' },
    { name: 'Moonlit Station', url: 'assets/music/04-moonlit-station.mp3' },
  ];
  let localTracks = [];
  let tracks = bgmTracks;
  let mode = 'bgm';
  let index = 0;
  let playRequest = 0;
  let loading = false;

  audio.volume = 0.35;
  repeat.checked = true;
  try {
    const saved = JSON.parse(localStorage.getItem('small-town:music'));
    if (saved && Number.isFinite(saved.volume)) audio.volume = Math.max(0, Math.min(1, saved.volume));
    if (saved && typeof saved.repeat === 'boolean') repeat.checked = saved.repeat;
  } catch { /* storage unavailable */ }
  volume.value = Math.round(audio.volume * 100);
  $('music-volume-value').textContent = `${volume.value}%`;

  function savePreferences() {
    try {
      localStorage.setItem('small-town:music', JSON.stringify({ volume: audio.volume, repeat: repeat.checked }));
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

  function updatePlay() {
    play.textContent = audio.paused && !loading ? '▶ 播放' : '⏸ 暫停';
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
    } catch (error) {
      if (request === playRequest && error.name !== 'AbortError') {
        status.textContent = error.name === 'NotAllowedError'
          ? '請再按一次播放。' : '無法播放這首音樂，請選擇其他檔案。';
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
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `${i + 1}. ${track.name}`;
      button.title = track.name;
      button.classList.toggle('on', i === index);
      button.setAttribute('aria-current', i === index ? 'true' : 'false');
      button.addEventListener('click', () => selectTrack(i, true));
      return button;
    }));
    $('music-title').textContent = tracks[index].name;
    $('music-prev').disabled = $('music-next').disabled = tracks.length < 2;
    $('music-bgm').classList.toggle('on', mode === 'bgm');
    $('music-local').classList.toggle('on', mode === 'local');
    $('music-local').disabled = localTracks.length === 0;
  }

  function selectTrack(next, autoplay = false) {
    playRequest++;
    loading = false;
    audio.pause();
    index = next;
    audio.src = tracks[index].blobUrl ?? tracks[index].url;
    audio.loop = repeat.checked && tracks.length === 1;
    status.textContent = '';
    updateProgress();
    updatePlay();
    renderList();
    if (autoplay) start();
  }

  function switchMode(next) {
    if (mode === next) return;
    const autoplay = !audio.paused || loading;
    mode = next;
    tracks = mode === 'bgm' ? bgmTracks : localTracks;
    selectTrack(0, autoplay);
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
    if (audio.paused && !loading) {
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
  $('music-prev').addEventListener('click', () => selectTrack((index + tracks.length - 1) % tracks.length, !audio.paused));
  $('music-next').addEventListener('click', () => selectTrack((index + 1) % tracks.length, !audio.paused));
  $('music-bgm').addEventListener('click', () => switchMode('bgm'));
  $('music-local').addEventListener('click', () => switchMode('local'));
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
    selectTrack(0, autoplay);
  });
  seek.addEventListener('input', () => { audio.currentTime = Number(seek.value); });
  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value) / 100;
    $('music-volume-value').textContent = `${volume.value}%`;
    savePreferences();
  });
  repeat.addEventListener('change', () => {
    audio.loop = repeat.checked && tracks.length === 1;
    savePreferences();
  });
  audio.addEventListener('play', updatePlay);
  audio.addEventListener('pause', updatePlay);
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('ended', () => {
    if (index + 1 < tracks.length) selectTrack(index + 1, true);
    else if (repeat.checked) selectTrack(0, true);
    else updatePlay();
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
  selectTrack(0);
}
