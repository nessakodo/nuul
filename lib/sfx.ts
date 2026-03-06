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
