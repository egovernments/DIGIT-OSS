export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};

export const obscureText = (value, hide = true, pattern = "*") => {
  if (!hide) return value;

  return value
    .split(" ")
    .map(
      (name) =>
      name.charAt(0).toUpperCase() +
      Array(name.length - 1)
      .fill(pattern)
      .join("")
    )
    .join(" ");
};