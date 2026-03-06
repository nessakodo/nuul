export function playChime() {
  if (typeof window === "undefined") return;
  const audioCtx = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 440;
  gain.gain.value = 0.0001;

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.02);
  oscillator.frequency.exponentialRampToValueAtTime(660, audioCtx.currentTime + 0.18);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
  oscillator.stop(audioCtx.currentTime + 0.52);
}

export function playHover() {
  if (typeof window === "undefined") return;
  const audioCtx = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = 980;
  gain.gain.value = 0.0001;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.02, audioCtx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
  osc.stop(audioCtx.currentTime + 0.14);
}

export function playReveal() {
  if (typeof window === "undefined") return;
  const audioCtx = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 360;
  gain.gain.value = 0.0001;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.08);
  osc.frequency.exponentialRampToValueAtTime(520, audioCtx.currentTime + 0.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
  osc.stop(audioCtx.currentTime + 0.62);
}

let droneNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;

export function startDrone() {
  if (typeof window === "undefined") return;
  if (droneNodes) return;
  const audioCtx = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc1.type = "sine";
  osc2.type = "sine";
  osc1.frequency.value = 54;
  osc2.frequency.value = 81;
  gain.gain.value = 0.0001;
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);
  osc1.start();
  osc2.start();
  gain.gain.exponentialRampToValueAtTime(0.025, audioCtx.currentTime + 1.2);
  droneNodes = { osc1, osc2, gain };
}

export function stopDrone() {
  if (!droneNodes) return;
  const { osc1, osc2, gain } = droneNodes;
  const ctx = gain.context;
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
  osc1.stop(ctx.currentTime + 1.1);
  osc2.stop(ctx.currentTime + 1.1);
  droneNodes = null;
}
