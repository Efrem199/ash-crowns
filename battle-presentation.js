// This controller only gates presentation. It never recalculates a battle.
export function createBattlePresentation({
  resolve,
  show,
  finish,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  duration = 3600,
}) {
  let busy = false,
    timer = null,
    report = null;
  const complete = () => {
    if (!busy) return false;
    busy = false;
    if (timer !== null) clearTimer(timer);
    timer = null;
    finish(report);
    return true;
  };
  return {
    get busy() {
      return busy;
    },
    get report() {
      return report;
    },
    start(payload, animate = true) {
      if (busy) return null;
      busy = true;
      try {
        report = resolve(payload);
      } catch (error) {
        busy = false;
        throw error;
      }
      if (!report) {
        busy = false;
        return null;
      }
      show(report, animate);
      if (animate) timer = setTimer(complete, duration);
      else complete();
      return report;
    },
    skip: complete,
  };
}
