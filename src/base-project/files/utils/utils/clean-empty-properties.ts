export function cleanEmptyProperties(object: any) {
  const obj = Object.assign({}, object);
  Object.keys(obj).forEach((key) => (!obj[key] || obj[key].length === 0) && delete obj[key]);
  return obj;
}
