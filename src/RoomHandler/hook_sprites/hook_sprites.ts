import * as fs from 'fs';
import * as dm from '../utilities/json';
import * as fl from '../utilities/file';

export type Sprite = {
  bbox_left: number
  bbox_right: number
  bbox_top: number
  bbox_bottom: number
  width: number
  height: number
  xorigin: number
  yorigin: number
  name: string
}

export function load_sprite(in_path_project: string, sprite_name: string): null | Sprite {
  const sprite_file = fl.prepare_path_file_yy(in_path_project, "sprites", sprite_name);
  if (fs.existsSync(sprite_file)) {
    
    const json: any = dm.json_parse(fs.readFileSync(sprite_file).toString());
    return {
      bbox_left: json.bbox_left,
      bbox_right: json.bbox_right,
      bbox_top: json.bbox_top,
      bbox_bottom: json.bbox_bottom,
      width: json.width,
      height: json.height,
      name: json.name,
      xorigin: json.sequence.xorigin,
      yorigin: json.sequence.yorigin,
    };
  }
  return null;
}

export function load_sprite_from_object(in_path_project: string, object_name: string): null | Sprite {
  const object_file = fl.prepare_path_file_yy(in_path_project, "objects", object_name);
  if (fs.existsSync(object_file)) {

    const json: any = dm.json_parse(fs.readFileSync(object_file).toString());
    return load_sprite(in_path_project, json.spriteId.name);
  }
  return null;
}
