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
