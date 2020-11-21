function get(path: string) {
  if (localStorage[path] === undefined)
    return "未プレイ";
  return convertString(localStorage[path]!.split(",")[0]) + " "
    + "(" + localStorage[path]!.split(",")[1] + ")";
}

function set(path: string, time: number, solve: number) {
  let bestData = localStorage[path];
  let bestTime = (bestData === undefined ? 0 : parseInt(bestData.split(",")[0]));
  let bestSolve = (bestData === undefined ? 0 : parseInt(bestData.split(",")[1]));
  if (bestSolve < solve || (bestSolve === solve && time < bestTime)) {
    localStorage[path] = String(time) + "," + String(solve);
    return true;
  }
  return false;
}

function convertString(time: number): string {
  let second = time % 6000 / 100;
  let minute = Math.floor(time / 6000);
  return ("000" + minute.toFixed()).slice(-3) + ":" + ("0" + second.toFixed(2)).slice(-5);
}

function getTimerString(startTime: number): string {
  let now = new Date().getTime() / 10 - startTime;
  return convertString(now);
}

export { get, set, getTimerString, convertString };
