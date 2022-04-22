export const array2Map = (array: string[]): POJO<boolean> => {
  const map: POJO<boolean> = {}
  array.forEach(item => map[item] = true)
  return map
}