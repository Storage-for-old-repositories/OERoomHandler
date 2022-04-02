
export function json_prepare(json: string) {
  let replace = new Map;
  replace.set("\r", "");
  replace.set("\n", "");
  replace.set(" :", ":");
  replace.set(":  ", ":");
  replace.set(", ", ",");
  replace.set(" ]", "]");
  replace.set("] ", "]");
  replace.set(" [", "[");
  replace.set("[ ", "[");
  replace.set(",]", "]");
  replace.set("},]", "}]");
  replace.set("},}", "}}");
  replace.set("],]", "]]");
  replace.set(" }", "}");
  replace.set("} ", "}");
  replace.set(" {", "{");
  replace.set("{ ", "{");
  replace.set(",}", "}");

  // replace.set(/]\s*?,\s*?]/gs, "]]");
  // replace.set(/}\s*?,\s*?]/gs, "}]");
  // replace.set(/]\s*?,\s*?}/gs, "]}");
  // replace.set(/}\s*?,\s*?}/gs, "}}");
  // replace.set(/[\n\r\t][\n\r\t]/gs, " ");
  // replace.set(/[\n\r\t]*?,[\n\r\t]*?/gs, ",");
  // replace.set(/[\n\r\t]/gs, "");

  replace.forEach((value, key) => {
    let _json = "";
    while (json != _json) {
      _json = json;
      json = _json.replaceAll(key, value);
    }
  });
  return json;
}

export function json_parse(json: string) {
  return JSON.parse(json_prepare(json));
}
