function get(path: string) {
  if (localStorage[path] === undefined)
    return "未プレイ";
  return localStorage[path]!.split(",")[0] + "秒 "
    + "(" + localStorage[path]!.split(",")[1] + ")";
}

function set(path: string, time: number, solve: number) {
  let bestTime = parseInt(localStorage[path].split(",")[0]);
  let bestSolve = parseInt(localStorage[path].split(",")[1]);
  if (bestTime === undefined || bestSolve < solve || (bestSolve === solve && time < bestTime)) {
    localStorage[path] = String(time) + "," + String(solve);
    return true;
  }
  return false;
}

export { get, set };
