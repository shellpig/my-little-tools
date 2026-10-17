// The wishing fountain: coins thrown into the park fountain, and the town
// blessings they sometimes bring.
import * as THREE from 'three';

// `when`: the part of the day a blessing can happen in.
export const BLESSINGS = [
  { id: 'rainbow-fountain', icon: '⛲', name: '彩虹噴泉', rarity: 'common', when: 'any', desc: '噴泉的水變成流轉的彩虹色。' },
  { id: 'duck', icon: '🦆', name: '小鴨', rarity: 'common', when: 'any', desc: '水池裡浮出一隻小黃鴨，待到明天早上。' },
  { id: 'lanterns', icon: '🏮', name: '天燈', rarity: 'common', when: 'night', desc: '公園升起一盞盞天燈。' },
  { id: 'fireflies', icon: '✨', name: '螢火蟲', rarity: 'common', when: 'night', desc: '螢火蟲出來了，有幾隻會跟著你。' },
  { id: 'balloon', icon: '🎈', name: '熱氣球', rarity: 'common', when: 'day', desc: '一顆熱氣球慢慢飄過小鎮。' },
  { id: 'bubbles', icon: '🫧', name: '彩色泡泡', rarity: 'common', when: 'day', desc: '噴水池冒出好多泡泡，點一下會破。' },
  { id: 'rainbow', icon: '🌈', name: '天空彩虹', rarity: 'rare', when: 'day', desc: '一道彩虹橫過小鎮的天空。' },
  { id: 'fireworks', icon: '🎆', name: '煙火大會', rarity: 'rare', when: 'night', desc: '天際線上放起了煙火。' },
  { id: 'market', icon: '🍢', name: '夜市開張', rarity: 'rare', when: 'evening', desc: '後街掛起燈籠擺起攤，大家都出來逛。' },
  { id: 'snow', icon: '❄️', name: '初雪', rarity: 'legendary', when: 'any', desc: '下雪了，小鎮慢慢變白。' },
];
export const RARITY = {
  common: { label: '祝福', weight: 10, color: '#4fd1c5' },
  rare: { label: '稀有祝福', weight: 3, color: '#b388ff' },
  legendary: { label: '傳說祝福', weight: 0.8, color: '#ffd166' },
};

const COIN_LINES = ['願望收到了。', '撲通！', '硬幣沉到池底了。', '希望會實現。', '水面閃了一下。'];
const BLESS_CHANCE = 0.33;
const GUARANTEED_EVERY = 10;

const rnd = (a, b) => a + Math.random() * (b - a);
const fade = (t, length, edge) => Math.min(1, t / edge, (length - t) / edge);

function inPart(when, t) {
  if (when === 'day') return t >= 6.5 && t < 17.5;
  if (when === 'night') return t >= 18.5 || t < 5.5;
  if (when === 'evening') return t >= 17 || t < 1;
  return true;
}

let snowDotTexture;
export function getSnowDotTexture() {
  if (snowDotTexture) return snowDotTexture;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,.6)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  snowDotTexture = new THREE.CanvasTexture(c);
  return snowDotTexture;
}

export function createSnowfall(scene, positions) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ size: 0.07, map: getSnowDotTexture(), color: 0xffffff, transparent: true, depthWrite: false });
  const flakes = new THREE.Points(geo, mat);
  flakes.frustumCulled = false;
  scene.add(flakes);
  return flakes;
}

// Snow settles on whatever faces up: every standard material mixes towards
// white by how much its surface points at the sky, times `snow.value`.
export const snow = { value: 0 };
const snowPatchedMaterials = new WeakSet();
function patchSnowMaterial(mat) {
  if (!mat?.isMeshStandardMaterial || snowPatchedMaterials.has(mat)) return;
  snowPatchedMaterials.add(mat);
  const onBeforeCompile = mat.onBeforeCompile;
  mat.onBeforeCompile = function (shader, renderer) {
    onBeforeCompile?.call(this, shader, renderer);
    shader.uniforms.snowAmount = snow;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vSnowNormal;')
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvSnowNormal = mat3(modelMatrix) * objectNormal;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vSnowNormal;\nuniform float snowAmount;')
      .replace('#include <map_fragment>', `#include <map_fragment>
            float snowUp = smoothstep(0.55, 0.9, normalize(vSnowNormal).y);
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.93, 0.95, 0.98), snowAmount * snowUp);`);
  };
  mat.customProgramCacheKey = () => 'snow';
  mat.needsUpdate = true;
}
export function patchSnow(root) {
  if (Array.isArray(root)) root.forEach(patchSnowMaterial);
  else if (root?.isMaterial) patchSnowMaterial(root);
  else root?.traverse?.(o => { for (const mat of [o.material].flat()) patchSnowMaterial(mat); });
}

function snowMaterial(options) {
  const mat = new THREE.MeshStandardMaterial(options);
  patchSnow(mat);
  return mat;
}

export function createWishes(town) {
  const { scene, camera, park, fountain, getTime, setCrowdBoost, pointerGround, streets, weather } = town;
  const centre = new THREE.Vector3(0, 0.09, park.cz);
  const dot = getSnowDotTexture();
  const effects = []; // { blessing, update(dt) → still running, end() }
  const clickables = new Set();
  const flights = [];
  const ripples = [];
  const restingCoins = [];
  let spoutBoost = 0;
  let coins = 0;
  // The fireworks flash stays in the scene, dark, all the time: adding or
  // removing a light makes every material recompile, a visible stall.
  const flash = new THREE.PointLight(0xffffff, 0, 40, 1.2);
  scene.add(flash);

  const coinGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.007, 16);
  // Half metal: with nothing to reflect, full metal reads as dark brown.
  const coinMat = snowMaterial({ color: 0xffcf4d, metalness: 0.35, roughness: 0.35, emissive: 0xb07a00, emissiveIntensity: 0.5 });
  const rippleGeo = new THREE.RingGeometry(0.03, 0.045, 32).rotateX(-Math.PI / 2);

  // ---- coins ----

  function throwCoin(onLand) {
    const coin = new THREE.Mesh(coinGeo, coinMat);
    const from = camera.position.clone().lerp(centre, 0.8).add(new THREE.Vector3(0, 0.4, 0));
    const a = Math.random() * Math.PI * 2;
    const r = rnd(0.16, 0.44);
    const to = new THREE.Vector3(Math.cos(a) * r, 0.093, park.cz + Math.sin(a) * r);
    coin.position.copy(from);
    scene.add(coin);
    flights.push({ coin, from, to, t: 0, onLand });
  }

  function land(f) {
    f.coin.rotation.set(0, Math.random() * 3, 0);
    f.coin.position.copy(f.to);
    restingCoins.push(f.coin);
    if (restingCoins.length > 40) scene.remove(restingCoins.shift());
    for (const delay of [0, 0.18]) {
      const ring = new THREE.Mesh(rippleGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false }));
      ring.position.copy(f.to).y += 0.003;
      ring.visible = false;
      scene.add(ring);
      ripples.push({ ring, t: -delay });
    }
    spoutBoost = 1;
    coins++;
    f.onLand(wish());
  }

  // Each coin may bring a blessing that fits the time of day and is not
  // already running; every tenth coin always does.
  function wish() {
    const t = getTime();
    if (coins % GUARANTEED_EVERY && Math.random() > BLESS_CHANCE) {
      return { line: COIN_LINES[Math.floor(Math.random() * COIN_LINES.length)] };
    }
    const pool = BLESSINGS.filter(b => inPart(b.when, t) && START[b.id].ready());
    let roll = Math.random() * pool.reduce((sum, b) => sum + RARITY[b.rarity].weight, 0);
    const blessing = pool.find(b => (roll -= RARITY[b.rarity].weight) < 0);
    if (!blessing) return { line: COIN_LINES[0] };
    const effect = START[blessing.id].start();
    effects.push({ blessing, ...effect });
    return { line: blessing.desc, blessing };
  }

  // ---- blessings ----

  const running = id => effects.some(e => e.blessing.id === id);
  const once = id => ({ ready: () => !running(id) });

  const START = {
    'rainbow-fountain': {
      ...once('rainbow-fountain'),
      start() {
        const w = fountain.water;
        const color = w.color.clone();
        const emissive = w.emissive.clone();
        let t = 0;
        return {
          update(dt) {
            t += dt;
            const hue = (t * 0.12) % 1;
            w.color.setHSL(hue, 0.8, 0.55);
            w.emissive.setHSL((hue + 0.1) % 1, 0.9, 0.5);
            w.userData.boost = 0.7 * Math.max(0, fade(t, 90, 3));
            return t < 90;
          },
          end() {
            w.color.copy(color);
            w.emissive.copy(emissive);
            w.userData.boost = 0;
          },
        };
      },
    },

    duck: {
      ready: () => effects.filter(e => e.blessing.id === 'duck').length < 3,
      start() {
        const duck = new THREE.Group();
        const m = c => snowMaterial({ color: c, roughness: 0.6 });
        const part = (w, h, d, mat, x, y, z) => {
          const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
          b.position.set(x, y, z);
          b.castShadow = true;
          duck.add(b);
        };
        const yellow = m(0xffd23f);
        part(0.11, 0.05, 0.075, yellow, 0, 0.02, 0);
        part(0.03, 0.03, 0.05, yellow, -0.055, 0.04, 0);
        part(0.05, 0.05, 0.05, yellow, 0.04, 0.065, 0);
        part(0.03, 0.012, 0.03, m(0xff8c2a), 0.075, 0.06, 0);
        for (const z of [-0.018, 0.018]) part(0.006, 0.01, 0.01, m(0x111111), 0.064, 0.075, z);
        scene.add(duck);
        let angle = Math.random() * Math.PI * 2;
        let last = getTime();
        // Until seven tomorrow morning, in game hours.
        let left = (7 - last + 24) % 24 || 24;
        const r = rnd(0.26, 0.36);
        return {
          update(dt) {
            const now = getTime();
            left -= (now - last + 24) % 24;
            last = now;
            angle += dt * 0.25;
            duck.position.set(Math.cos(angle) * r, 0.09 + Math.sin(angle * 5) * 0.004, park.cz + Math.sin(angle) * r);
            duck.rotation.y = -angle - Math.PI / 2;
            return left > 0;
          },
          end() { scene.remove(duck); },
        };
      },
    },

    lanterns: {
      ...once('lanterns'),
      start() {
        const glow = snowMaterial({ color: 0xffc070, emissive: 0xff8a2a, emissiveIntensity: 2.2, transparent: true });
        const geo = new THREE.BoxGeometry(0.11, 0.15, 0.11);
        const lanterns = [];
        let t = 0;
        return {
          update(dt) {
            t += dt;
            if (lanterns.length < 16 && t > lanterns.length * 0.6) {
              const mesh = new THREE.Mesh(geo, glow.clone());
              const a = Math.random() * Math.PI * 2;
              const r = rnd(0.7, 3);
              mesh.position.set(Math.cos(a) * r, 0.1, park.cz + Math.sin(a) * r);
              scene.add(mesh);
              lanterns.push({ mesh, phase: Math.random() * 6, speed: rnd(0.22, 0.32) });
            }
            for (const l of lanterns) {
              l.phase += dt;
              l.mesh.position.y += l.speed * dt;
              l.mesh.position.x += Math.sin(l.phase * 0.8) * 0.06 * dt;
              l.mesh.position.z -= 0.12 * dt;
              l.mesh.material.opacity = Math.min(1, Math.max(0, (7.5 - l.mesh.position.y) / 1.5));
            }
            return lanterns.length < 16 || lanterns.some(l => l.mesh.material.opacity > 0);
          },
          end() { for (const l of lanterns) scene.remove(l.mesh); },
        };
      },
    },

    fireflies: {
      ...once('fireflies'),
      start() {
        const count = 110;
        const followers = 18;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        const flies = Array.from({ length: count }, (_, i) => {
          // Most over the park lawn, some down the lanes.
          const lane = i % 5 === 0;
          const x = lane ? streets.alleys[i % 2] + rnd(-0.4, 0.4) : rnd(-4.4, 4.4);
          const z = lane ? rnd(streets.back + 1.6, -1.6) : rnd(park.zMin + 0.2, park.zMax - 0.2);
          return { home: new THREE.Vector3(x, rnd(0.08, 0.6), z), p: new THREE.Vector3(x, 0.3, z), phase: Math.random() * 20, blink: rnd(1.5, 3.5) };
        });
        const points = new THREE.Points(geo, new THREE.PointsMaterial({
          size: 0.16, map: dot, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        }));
        scene.add(points);
        let t = 0;
        return {
          update(dt) {
            t += dt;
            const strength = Math.max(0, fade(t, 100, 4));
            const target = pointerGround();
            flies.forEach((f, i) => {
              f.phase += dt;
              const goal = i < followers && target
                ? target.clone().add(new THREE.Vector3(Math.sin(f.phase * 1.3 + i) * 0.25, 0.25 + Math.sin(f.phase * 0.9) * 0.1, Math.cos(f.phase * 1.1 + i) * 0.25))
                : f.home.clone().add(new THREE.Vector3(Math.sin(f.phase * 0.5) * 0.3, Math.sin(f.phase * 0.8) * 0.1, Math.cos(f.phase * 0.4) * 0.3));
              f.p.lerp(goal, Math.min(1, dt * (i < followers ? 1.6 : 0.8)));
              pos.set([f.p.x, f.p.y, f.p.z], i * 3);
              // Above white at the peak of a blink, so it blooms.
              const b = 2.6 * strength * Math.max(0, Math.sin(f.phase * f.blink)) ** 2;
              col.set([1.0 * b, 0.95 * b, 0.35 * b], i * 3);
            });
            geo.attributes.position.needsUpdate = true;
            geo.attributes.color.needsUpdate = true;
            return t < 100;
          },
          end() { scene.remove(points); },
        };
      },
    },

    fireworks: {
      ...once('fireworks'),
      start() {
        const colors = [0xff4d6d, 0xffd166, 0x06d6a0, 0x4cc9f0, 0xb388ff, 0xff9f1c, 0xffffff].map(c => new THREE.Color(c));
        const bursts = [];
        let t = 0;
        let next = 0;
        const burst = () => {
          const n = 140;
          const geo = new THREE.BufferGeometry();
          const pos = new Float32Array(n * 3);
          const vel = [];
          const origin = new THREE.Vector3(rnd(-9, 9), rnd(5, 8), rnd(-13, -7));
          for (let i = 0; i < n; i++) {
            pos.set([origin.x, origin.y, origin.z], i * 3);
            vel.push(new THREE.Vector3().randomDirection().multiplyScalar(rnd(1.2, 1.9)));
          }
          geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
          // Brighter than white so the sparks bloom.
          const color = colors[Math.floor(Math.random() * colors.length)];
          const mat = new THREE.PointsMaterial({
            size: 0.38, map: dot, color: color.clone().multiplyScalar(3), transparent: true, depthWrite: false,
            blending: THREE.AdditiveBlending, fog: false,
          });
          const points = new THREE.Points(geo, mat);
          scene.add(points);
          bursts.push({ points, pos, vel, age: 0 });
          flash.position.copy(origin);
          flash.color.copy(color);
          flash.intensity = 60;
        };
        return {
          update(dt) {
            t += dt;
            if (t < 60 && t >= next) {
              burst();
              next = t + rnd(0.5, 1.4);
            }
            flash.intensity *= Math.exp(-dt * 6);
            for (const b of bursts) {
              b.age += dt;
              b.vel.forEach((v, i) => {
                v.multiplyScalar(Math.exp(-dt * 1.2));
                v.y -= 0.5 * dt;
                b.pos[i * 3] += v.x * dt;
                b.pos[i * 3 + 1] += v.y * dt;
                b.pos[i * 3 + 2] += v.z * dt;
              });
              b.points.geometry.attributes.position.needsUpdate = true;
              b.points.material.opacity = Math.max(0, 1 - b.age / 3);
            }
            for (let i = bursts.length; i--;) {
              if (bursts[i].age > 3) {
                scene.remove(bursts[i].points);
                bursts.splice(i, 1);
              }
            }
            return t < 60 || bursts.length > 0;
          },
          end() {
            for (const b of bursts) scene.remove(b.points);
            flash.intensity = 0;
          },
        };
      },
    },

    balloon: {
      ...once('balloon'),
      start() {
        const balloon = new THREE.Group();
        const hues = [0xff595e, 0xffca3a, 0x8ac926, 0x1982c4, 0x6a4c93, 0xff924c, 0x52a675, 0xf15bb5];
        hues.forEach((c, i) => {
          const seg = new THREE.Mesh(
            new THREE.SphereGeometry(0.55, 4, 14, i * Math.PI / 4, Math.PI / 4),
            snowMaterial({ color: c, roughness: 0.6, side: THREE.DoubleSide }),
          );
          seg.scale.y = 1.2;
          seg.castShadow = true;
          balloon.add(seg);
        });
        const basket = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.13, 0.18), snowMaterial({ color: 0x8a5a3a }));
        basket.position.y = -0.95;
        basket.castShadow = true;
        balloon.add(basket);
        for (const [x, z] of [[-0.08, -0.08], [0.08, -0.08], [-0.08, 0.08], [0.08, 0.08]]) {
          const rope = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.36, 0.008), snowMaterial({ color: 0x3b2f2a }));
          rope.position.set(x * 1.6, -0.72, z * 1.6);
          balloon.add(rope);
        }
        scene.add(balloon);
        let t = 0;
        return {
          update(dt) {
            t += dt;
            balloon.position.set(-18 + t * 0.42, 4.4 + Math.sin(t * 0.4) * 0.25, -2.5 + Math.sin(t * 0.15) * 1.5);
            balloon.rotation.y = t * 0.1;
            return balloon.position.x < 18;
          },
          end() { scene.remove(balloon); },
        };
      },
    },

    bubbles: {
      ...once('bubbles'),
      start() {
        const mats = [0xff8fab, 0xffd6a5, 0xcaffbf, 0x9bf6ff, 0xa0c4ff, 0xbdb2ff].map(c => new THREE.MeshPhysicalMaterial({
          color: c, transparent: true, opacity: 0.65, roughness: 0, metalness: 0, clearcoat: 1,
          iridescence: 1, iridescenceIOR: 1.3, depthWrite: false,
        }));
        const geo = new THREE.SphereGeometry(1, 16, 12);
        const bubbles = [];
        let t = 0;
        let spawn = 0;
        const pop = b => { b.popping = 0.15; };
        return {
          update(dt) {
            t += dt;
            spawn += dt;
            while (t < 40 && spawn > 0.2) {
              spawn -= 0.2;
              const mesh = new THREE.Mesh(geo, mats[Math.floor(Math.random() * mats.length)]);
              const size = rnd(0.035, 0.09);
              mesh.scale.setScalar(size);
              mesh.position.set(rnd(-0.1, 0.1), 0.42, park.cz + rnd(-0.1, 0.1));
              const b = { mesh, size, rise: rnd(0.18, 0.4), drift: new THREE.Vector2(rnd(-0.12, 0.2), rnd(-0.15, 0.1)), phase: Math.random() * 6, age: 0 };
              mesh.userData.onClick = () => pop(b);
              clickables.add(mesh);
              scene.add(mesh);
              bubbles.push(b);
            }
            for (const b of bubbles) {
              b.age += dt;
              b.phase += dt;
              if (b.popping !== undefined) {
                b.popping -= dt;
                b.mesh.scale.setScalar(b.size * (1 + (0.15 - b.popping) * 6));
                continue;
              }
              b.mesh.position.x += (b.drift.x + Math.sin(b.phase * 2) * 0.05) * dt;
              b.mesh.position.z += b.drift.y * dt;
              b.mesh.position.y += b.rise * dt;
              if (b.mesh.position.y > 3.5 || b.age > 14) pop(b);
            }
            for (let i = bubbles.length; i--;) {
              if (bubbles[i].popping <= 0) {
                scene.remove(bubbles[i].mesh);
                clickables.delete(bubbles[i].mesh);
                bubbles.splice(i, 1);
              }
            }
            return t < 40 || bubbles.length > 0;
          },
          end() {
            for (const b of bubbles) {
              scene.remove(b.mesh);
              clickables.delete(b.mesh);
            }
          },
        };
      },
    },

    rainbow: {
      ...once('rainbow'),
      start() {
        const arcs = [0xff3b30, 0xff9500, 0xffcc00, 0x34c759, 0x32ade6, 0x5856d6, 0xaf52de].map((c, i) => {
          const arc = new THREE.Mesh(
            new THREE.TorusGeometry(13 - i * 0.26, 0.14, 6, 96, Math.PI),
            new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0, depthWrite: false, fog: false }),
          );
          arc.position.set(0, -1.5, -22);
          scene.add(arc);
          return arc;
        });
        let t = 0;
        return {
          update(dt) {
            t += dt;
            for (const a of arcs) a.material.opacity = 0.45 * Math.max(0, fade(t, 90, 8));
            return t < 90;
          },
          end() { for (const a of arcs) scene.remove(a); },
        };
      },
    },

    market: {
      ...once('market'),
      start() {
        const group = new THREE.Group();
        const S = streets.back;
        const red = snowMaterial({ color: 0xd62828, emissive: 0xff3b1f, emissiveIntensity: 1.8 });
        const wire = snowMaterial({ color: 0x222222 });
        const warm = snowMaterial({ color: 0x222222, emissive: 0xffd49a, emissiveIntensity: 2 });
        // Strings of lanterns across the street.
        for (let x = -4.5; x <= 4.5; x += 1) {
          const span = 2.9;
          const line = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.008, span), wire);
          line.position.set(x, 0.95, S);
          group.add(line);
          for (let k = 0; k < 5; k++) {
            const z = S - span / 2 + (k + 0.5) * span / 5;
            const sag = 0.06 * (1 - ((z - S) / (span / 2)) ** 2);
            const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), red);
            lantern.scale.y = 1.25;
            lantern.position.set(x, 0.89 - sag, z);
            group.add(lantern);
          }
        }
        // Stalls along the back street's south sidewalk.
        const awnings = [0xef476f, 0xffd166, 0x06d6a0, 0x118ab2, 0xf78c6b];
        awnings.forEach((c, i) => {
          const x = -4 + i * 2;
          const z = S + 1.15;
          const table = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.2), snowMaterial({ color: 0x8a5a3a }));
          table.position.set(x, 0.11, z);
          const roof = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.025, 0.28), snowMaterial({ color: c }));
          roof.position.set(x, 0.36, z);
          const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.006, 0.12), warm);
          lamp.position.set(x, 0.345, z);
          for (const m of [table, roof]) m.castShadow = true;
          group.add(table, roof, lamp);
          for (const dx of [-0.2, 0.2]) {
            const post = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.3, 0.015), wire);
            post.position.set(x + dx, 0.2, z + 0.12);
            group.add(post);
          }
        });
        scene.add(group);
        setCrowdBoost(0.45);
        let last = getTime();
        let left = 3; // game hours
        return {
          update() {
            const now = getTime();
            left -= (now - last + 24) % 24;
            last = now;
            return left > 0;
          },
          end() {
            scene.remove(group);
            setCrowdBoost(0);
          },
        };
      },
    },

    snow: {
      ...once('snow'),
      start() {
        weather.blessSnow();
        let t = 0;
        return {
          update(dt) {
            t += dt;
            return t < 100;
          },
          end() { weather.cancelBlessing(); },
        };
      },
    },
  };

  function update(dt) {
    for (let i = flights.length; i--;) {
      const f = flights[i];
      f.t = Math.min(1, f.t + dt / 0.7);
      f.coin.position.lerpVectors(f.from, f.to, f.t).y += Math.sin(f.t * Math.PI) * 0.7;
      f.coin.rotation.x += dt * 14;
      if (f.t === 1) {
        flights.splice(i, 1);
        land(f);
      }
    }
    for (let i = ripples.length; i--;) {
      const r = ripples[i];
      r.t += dt;
      r.ring.visible = r.t > 0;
      r.ring.scale.setScalar(1 + Math.max(0, r.t) * 9);
      r.ring.material.opacity = Math.max(0, 0.8 - r.t);
      if (r.t > 0.8) {
        scene.remove(r.ring);
        ripples.splice(i, 1);
      }
    }
    spoutBoost = Math.max(0, spoutBoost - dt * 1.6);
    fountain.spout.scale.y = 1 + Math.sin(spoutBoost * Math.PI) * 1.2;
    fountain.spout.position.y = fountain.spoutY + (fountain.spout.scale.y - 1) * 0.05;
    for (let i = effects.length; i--;) {
      if (!effects[i].update(dt)) {
        effects[i].end();
        effects.splice(i, 1);
      }
    }
  }

  // Start a blessing directly, skipping the coin and the odds.
  function bless(id) {
    const blessing = BLESSINGS.find(b => b.id === id);
    if (!blessing || !START[id].ready()) return null;
    effects.push({ blessing, ...START[id].start() });
    return blessing;
  }

  return {
    throwCoin,
    bless,
    update,
    clickables: () => [...clickables],
    active: () => effects.map(e => e.blessing),
    flying: () => flights.length > 0,
  };
}
