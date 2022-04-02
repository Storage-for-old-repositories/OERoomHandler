
export function prepare_path(path: string): string {
  const path_prepare: string = path + (path[path.length - 1] == "\\" ? "" : "\\");
  return path_prepare;
}

export function prepare_name(name: string): string {
  let index;

  index = Math.max(name.lastIndexOf("\\"), name.lastIndexOf("/"));
  const name_full = (index == -1
    ? name
    : name.substring(index + 1)
  );

  index = name_full.indexOf(".");
  return (index == -1
    ? name_full
    : name_full.slice(0, name_full.indexOf("."))
  );
}

export function prepare_path_file_yy(path: string, group: string, name: string): string {
  const name_prepare = prepare_name(name);
  return `${prepare_path(path)}${group}\\${name_prepare}\\${name_prepare}.yy`;
}
