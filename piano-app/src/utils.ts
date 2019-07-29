export const secondsToClock = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m < 10 ? 0 : ""}${m}:${s < 10 ? 0 : ""}${s.toFixed(3)}`;
};

export default {
  secondsToClock
};
