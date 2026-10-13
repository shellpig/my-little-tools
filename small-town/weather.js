import * as THREE from 'three';
import { createSnowfall, snow } from './wishes.js';

const WEATHER = ['sunny', 'cloudy', 'rain', 'snow'];
const QUALITY = {
  high: { snow: 1800, rain: 480 },
  medium: { snow: 1000, rain: 260 },
  low: { snow: 500, rain: 140 },
};
const SNOW_HEIGHT = 24;
const RAIN_HEIGHT = 28;
const TRANSITION_SECONDS = 2;
const SNOW_MAX = 0.8;

const PRESETS = {
  sunny: {
    daySunScale: 1, nightSunScale: 1, dayHemiScale: 1, nightHemiScale: 1,
    skyTint: 0xffffff, skyMix: 0,
    hemiTint: 0xffffff, hemiMix: 0,
    groundTint: 0xffffff, groundMix: 0,
    fogTint: 0xffffff, fogMix: 0, fogNear: 1, fogFar: 1,
    rain: 0, snow: 0,
  },
  cloudy: {
    daySunScale: 0.72, nightSunScale: 0.97, dayHemiScale: 0.94, nightHemiScale: 1,
    skyTint: 0x9eacbd, skyMix: 0.18,
    hemiTint: 0xaab8c8, hemiMix: 0.08,
    groundTint: 0x737c87, groundMix: 0.07,
    fogTint: 0x778493, fogMix: 0.18, fogNear: 0.94, fogFar: 0.88,
    rain: 0, snow: 0,
  },
  rain: {
    daySunScale: 0.56, nightSunScale: 0.94, dayHemiScale: 0.92, nightHemiScale: 1,
    skyTint: 0x66778a, skyMix: 0.24,
    hemiTint: 0x8392a3, hemiMix: 0.1,
    groundTint: 0x68737f, groundMix: 0.12,
    fogTint: 0x586777, fogMix: 0.24, fogNear: 0.84, fogFar: 0.76,
    rain: 1, snow: 0,
  },
  snow: {
    daySunScale: 0.9, nightSunScale: 0.98, dayHemiScale: 0.98, nightHemiScale: 1,
    skyTint: 0xc4d1df, skyMix: 0.14,
    hemiTint: 0xc4d0dc, hemiMix: 0.08,
    groundTint: 0xa3adb7, groundMix: 0.08,
    fogTint: 0xbac6d1, fogMix: 0.18, fogNear: 0.9, fogFar: 0.84,
    rain: 0, snow: 1,
  },
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;
const isWeather = value => WEATHER.includes(value);
const randomInterval = () => 180 + Math.random() * 180;

function randomWeather() {
  const roll = Math.random();
  if (roll < 0.4) return 'sunny';
  if (roll < 0.7) return 'cloudy';
  if (roll < 0.9) return 'rain';
  return 'snow';
}

function makeProfile(type) {
  const preset = PRESETS[type];
  return {
    daySunScale: preset.daySunScale,
    nightSunScale: preset.nightSunScale,
    dayHemiScale: preset.dayHemiScale,
    nightHemiScale: preset.nightHemiScale,
    skyTint: new THREE.Color(preset.skyTint),
    skyMix: preset.skyMix,
    hemiTint: new THREE.Color(preset.hemiTint),
    hemiMix: preset.hemiMix,
    groundTint: new THREE.Color(preset.groundTint),
    groundMix: preset.groundMix,
    fogTint: new THREE.Color(preset.fogTint),
    fogMix: preset.fogMix,
    fogNear: preset.fogNear,
    fogFar: preset.fogFar,
    rain: preset.rain,
    snow: preset.snow,
  };
}

function copyProfile(from, to) {
  to.daySunScale = from.daySunScale;
  to.nightSunScale = from.nightSunScale;
  to.dayHemiScale = from.dayHemiScale;
  to.nightHemiScale = from.nightHemiScale;
  to.skyTint.copy(from.skyTint);
  to.skyMix = from.skyMix;
  to.hemiTint.copy(from.hemiTint);
  to.hemiMix = from.hemiMix;
  to.groundTint.copy(from.groundTint);
  to.groundMix = from.groundMix;
  to.fogTint.copy(from.fogTint);
  to.fogMix = from.fogMix;
  to.fogNear = from.fogNear;
  to.fogFar = from.fogFar;
  to.rain = from.rain;
  to.snow = from.snow;
}

function blendProfile(from, to, amount, out) {
  out.daySunScale = lerp(from.daySunScale, to.daySunScale, amount);
  out.nightSunScale = lerp(from.nightSunScale, to.nightSunScale, amount);
  out.dayHemiScale = lerp(from.dayHemiScale, to.dayHemiScale, amount);
  out.nightHemiScale = lerp(from.nightHemiScale, to.nightHemiScale, amount);
  out.skyTint.copy(from.skyTint).lerp(to.skyTint, amount);
  out.skyMix = lerp(from.skyMix, to.skyMix, amount);
  out.hemiTint.copy(from.hemiTint).lerp(to.hemiTint, amount);
  out.hemiMix = lerp(from.hemiMix, to.hemiMix, amount);
  out.groundTint.copy(from.groundTint).lerp(to.groundTint, amount);
  out.groundMix = lerp(from.groundMix, to.groundMix, amount);
  out.fogTint.copy(from.fogTint).lerp(to.fogTint, amount);
  out.fogMix = lerp(from.fogMix, to.fogMix, amount);
  out.fogNear = lerp(from.fogNear, to.fogNear, amount);
  out.fogFar = lerp(from.fogFar, to.fogFar, amount);
  out.rain = lerp(from.rain, to.rain, amount);
  out.snow = lerp(from.snow, to.snow, amount);
}

function finite(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

// Call applyLighting after applyTime; `focus` is the camera target and bounds use grid coordinates.
export function createWeather({ scene, camera, focus, sun, hemi, bounds, cellSize }) {
  const [i0, i1, j0, j1] = bounds;
  const mapWidth = (i1 - i0 + 1) * cellSize;
  const mapDepth = (j1 - j0 + 1) * cellSize;
  const baseFogNear = scene.fog?.near ?? 0;
  const baseFogFar = scene.fog?.far ?? 0;
  const baseFogColor = new THREE.Color();
  const baseSkyColor = new THREE.Color();
  const baseSunColor = new THREE.Color();
  const baseHemiColor = new THREE.Color();
  const baseGroundColor = new THREE.Color();
  const snowPositions = new Float32Array(QUALITY.high.snow * 3);
  for (let i = 0; i < QUALITY.high.snow; i++) {
    snowPositions.set([Math.random() * 2 - 1, Math.random(), Math.random() * 2 - 1], i * 3);
  }
  const flakes = createSnowfall(scene, snowPositions);
  flakes.geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
  const rainGeometry = new THREE.BufferGeometry();
  const rainPositions = new Float32Array(QUALITY.high.rain * 6);
  for (let i = 0; i < QUALITY.high.rain; i++) {
    const x = Math.random() * 2 - 1;
    const z = Math.random() * 2 - 1;
    const y = Math.random() * RAIN_HEIGHT;
    const dx = (Math.random() - 0.5) * 0.02;
    const dz = (Math.random() - 0.5) * 0.02;
    const length = 0.5 + Math.random() * 0.9;
    rainPositions.set([x, y, z, x + dx, y - length, z + dz], i * 6);
  }
  rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
  rainGeometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
  rainGeometry.setDrawRange(0, QUALITY.high.rain * 2);
  const rainMaterial = new THREE.LineBasicMaterial({ color: 0xd7e3ef, transparent: true, opacity: 0.32, depthWrite: false });
  const rain = new THREE.LineSegments(rainGeometry, rainMaterial);
  rain.frustumCulled = false;
  rain.visible = false;
  scene.add(rain);

  let mode = 'auto';
  let manualWeather = 'sunny';
  let autoWeather = 'sunny';
  let autoRemaining = randomInterval();
  let blessingRemaining = 0;
  let quality = 'high';
  let snowTime = 0;
  let desiredWeather = 'sunny';
  let transitionProgress = 1;
  let transitionFrom = makeProfile('sunny');
  let transitionTo = makeProfile('sunny');
  const currentProfile = makeProfile('sunny');

  function activeWeather() {
    if (blessingRemaining > 0) return 'snow';
    return mode === 'auto' ? autoWeather : manualWeather;
  }

  function beginTransition(weather) {
    if (weather === desiredWeather) return;
    desiredWeather = weather;
    copyProfile(currentProfile, transitionFrom);
    transitionTo = makeProfile(weather);
    transitionProgress = 0;
  }

  function resetProfile(weather) {
    desiredWeather = weather;
    transitionFrom = makeProfile(weather);
    transitionTo = makeProfile(weather);
    copyProfile(transitionTo, currentProfile);
    transitionProgress = 1;
  }

  function updateAuto(gameMinutesDelta) {
    if (mode !== 'auto' || gameMinutesDelta <= 0) return false;
    let remaining = gameMinutesDelta;
    let changed = false;
    while (remaining >= autoRemaining) {
      remaining -= autoRemaining;
      autoWeather = randomWeather();
      autoRemaining = randomInterval();
      changed = true;
    }
    autoRemaining -= remaining;
    return changed;
  }

  function updateCoverage() {
    const distance = camera.position.distanceTo(focus);
    const viewRadius = distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 2.2;
    const radiusX = Math.max(mapWidth * 0.25, viewRadius * camera.aspect);
    const radiusZ = Math.max(mapDepth * 0.25, viewRadius);
    flakes.position.x = focus.x;
    flakes.position.z = focus.z;
    flakes.scale.set(radiusX, SNOW_HEIGHT, radiusZ);
    rain.position.x = focus.x;
    rain.position.z = focus.z;
    rain.scale.set(radiusX, 1, radiusZ);
  }

  function setParticleQuality() {
    const counts = QUALITY[quality];
    flakes.geometry.setDrawRange(0, counts.snow);
    rainGeometry.setDrawRange(0, counts.rain * 2);
  }

  function updateParticles(dt) {
    const rainAmount = currentProfile.rain;
    const flakeAmount = currentProfile.snow;
    rain.visible = rainAmount > 0.005;
    flakes.visible = flakeAmount > 0.005;
    rainMaterial.opacity = 0.32 * rainAmount;
    flakes.material.opacity = 0.9 * flakeAmount;
    if (rain.visible || flakes.visible) updateCoverage();
    if (rain.visible) {
      const positions = rainGeometry.attributes.position.array;
      for (let i = 0; i < QUALITY[quality].rain; i++) {
        const top = i * 6 + 1;
        const bottom = top + 3;
        positions[top] -= 16 * dt;
        positions[bottom] -= 16 * dt;
        if (positions[bottom] < 0) {
          positions[top] += RAIN_HEIGHT;
          positions[bottom] += RAIN_HEIGHT;
        }
      }
      rainGeometry.attributes.position.needsUpdate = true;
    }
    if (flakes.visible) {
      const positions = flakes.geometry.attributes.position.array;
      snowTime += dt;
      for (let i = 0; i < QUALITY[quality].snow; i++) {
        const offset = i * 3;
        positions[offset + 1] -= 0.45 * dt / SNOW_HEIGHT;
        positions[offset] += Math.sin(snowTime + i) * 0.08 * dt / flakes.scale.x;
        if (positions[offset + 1] < 0) positions[offset + 1] += 1;
      }
      flakes.geometry.attributes.position.needsUpdate = true;
    }
  }

  function reconcileWeather() {
    beginTransition(activeWeather());
  }

  function select(selection) {
    if (selection === 'auto') {
      mode = 'auto';
      reconcileWeather();
      return;
    }
    if (!isWeather(selection)) return;
    blessingRemaining = 0;
    mode = 'manual';
    manualWeather = selection;
    reconcileWeather();
  }

  function update(realDt, gameMinutesDelta) {
    const dt = Math.max(0, finite(realDt, 0));
    const autoChanged = updateAuto(Math.max(0, finite(gameMinutesDelta, 0)));
    if (blessingRemaining > 0) blessingRemaining = Math.max(0, blessingRemaining - dt);
    reconcileWeather();
    if (transitionProgress < 1) {
      transitionProgress = Math.min(1, transitionProgress + dt / TRANSITION_SECONDS);
      blendProfile(transitionFrom, transitionTo, transitionProgress, currentProfile);
    }
    if (activeWeather() === 'snow') snow.value = Math.min(SNOW_MAX, snow.value + dt * SNOW_MAX / 50);
    else snow.value = Math.max(0, snow.value - dt * SNOW_MAX / 70);
    updateParticles(dt);
    return autoChanged;
  }

  function applyLighting() {
    if (desiredWeather === 'sunny' && transitionProgress >= 1) {
      if (scene.fog) {
        scene.fog.near = baseFogNear;
        scene.fog.far = baseFogFar;
      }
      return;
    }

    const sunIntensity = sun.intensity;
    const daylight = clamp((sunIntensity - 0.45) / (3 - 0.45), 0, 1);
    const weatherStrength = lerp(0.45, 1, daylight);
    baseSunColor.copy(sun.color);
    sun.intensity = sunIntensity * lerp(currentProfile.nightSunScale, currentProfile.daySunScale, daylight);
    sun.color.copy(baseSunColor).lerp(currentProfile.skyTint, currentProfile.skyMix * weatherStrength * 0.3);
    const hemiIntensity = hemi.intensity;
    baseHemiColor.copy(hemi.color);
    baseGroundColor.copy(hemi.groundColor);
    hemi.intensity = Math.max(0.3, hemiIntensity * lerp(currentProfile.nightHemiScale, currentProfile.dayHemiScale, daylight));
    hemi.color.copy(baseHemiColor).lerp(currentProfile.hemiTint, currentProfile.hemiMix * weatherStrength);
    hemi.groundColor.copy(baseGroundColor).lerp(currentProfile.groundTint, currentProfile.groundMix * weatherStrength);

    if (scene.background?.isColor) {
      baseSkyColor.copy(scene.background);
      scene.background.copy(baseSkyColor).lerp(currentProfile.skyTint, currentProfile.skyMix * weatherStrength);
    }
    if (scene.fog) {
      baseFogColor.copy(scene.fog.color);
      const fogStrength = (quality === 'low' ? 0.55 : 1) * weatherStrength;
      scene.fog.color.copy(baseFogColor).lerp(currentProfile.fogTint, currentProfile.fogMix * weatherStrength);
      scene.fog.near = baseFogNear * lerp(1, currentProfile.fogNear, fogStrength);
      scene.fog.far = baseFogFar * lerp(1, currentProfile.fogFar, fogStrength);
    }
  }

  function setQuality(nextQuality) {
    if (!QUALITY[nextQuality]) return;
    quality = nextQuality;
    setParticleQuality();
    updateParticles(0);
  }

  function snapshot() {
    return {
      mode,
      selection: mode === 'auto' ? 'auto' : manualWeather,
      autoWeather,
      autoRemaining,
      snowAmount: snow.value,
    };
  }

  function restore(state) {
    const selection = state?.selection;
    mode = isWeather(selection) ? 'manual' : 'auto';
    manualWeather = isWeather(selection) ? selection : 'sunny';
    autoWeather = isWeather(state?.autoWeather) ? state.autoWeather : 'sunny';
    autoRemaining = clamp(finite(state?.autoRemaining, randomInterval()), 0, 360);
    blessingRemaining = 0;
    snow.value = clamp(finite(state?.snowAmount, 0), 0, SNOW_MAX);
    resetProfile(activeWeather());
    updateParticles(0);
  }

  function blessSnow() {
    blessingRemaining = 100;
    reconcileWeather();
  }

  function cancelBlessing() {
    if (blessingRemaining <= 0) return;
    blessingRemaining = 0;
    reconcileWeather();
  }

  setParticleQuality();
  return { select, currentWeather: activeWeather, update, applyLighting, setQuality, snapshot, restore, blessSnow, cancelBlessing };
}
