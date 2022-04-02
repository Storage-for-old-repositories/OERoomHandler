import * as fs from 'fs';
import * as dm from './utilities/json';
import * as fl from './utilities/file';

type Resource = any;
type MaybeResourceFilter = null | IGMRTypeContainer<Resource[]>;
type Out = string | RoomFileOutDescription;

type Meta = {
  file_out: string
  gm_vpath: string
}

const enum GMRType {
  ASSETS = "GMRAssetLayer",
  INSTANCES = "GMRInstanceLayer"
}

interface IGMRTypeContainer<T> {
  [GMRType.ASSETS]: T
  [GMRType.INSTANCES]: T
}

export type FilteredElements = null | {
  assets: Resource[]
  instances: Resource[]
}

export type RoomFileOutDescription = {
  name: string
  path?: string
  gm_parent_path?: string
}

const GMRTypePrefix: IGMRTypeContainer<string> = {
  [GMRType.ASSETS]: "np_scol_",
  [GMRType.INSTANCES]: "np_obj_",
}

const default_gm_vpath: string = "folders\\OE_GenerateRooms.yy";

function room_handler_prepare_json(json: Resource, meta: Meta): void {

  json.inheritLayers = false;
  json.inheritCreationOrder = false;

  const orderSet = new Set<string>();

  json.layers.forEach((resource: Resource) => {

    if (resource.resourceType === GMRType.INSTANCES) {

      resource.instances.forEach((instance: any) => {

        instance.inheritCode = true;
        orderSet.add(instance.name);
      });
    }
  });

  const name = fl.prepare_name(meta.file_out);
  const instanceCreationOrder_path = `rooms\\${name}\\${name}.yy`;
  const instanceCreationOrder = json.instanceCreationOrder.filter(
    (resource: Resource): boolean => {

      if (orderSet.has(resource.name)) {

        resource.path = instanceCreationOrder_path;
        return true;
      }

      return false;
    }
  );

  json.instanceCreationOrder = instanceCreationOrder;
  json.name = name;

  json.parent.name = fl.prepare_name(meta.gm_vpath);
  json.parent.path = meta.gm_vpath;
}

function room_handler_filter(in_path_project: string, in_room_name: string, out_room_file_description?: Out): MaybeResourceFilter {

  const room_file: string = fl.prepare_path_file_yy(in_path_project, "rooms", in_room_name);

  if (fs.existsSync(room_file)) {

    const json: Resource = dm.json_parse(fs.readFileSync(room_file).toString());

    const result: IGMRTypeContainer<Resource[]> = {
      [GMRType.ASSETS]: [],
      [GMRType.INSTANCES]: [],
    }

    let type: keyof IGMRTypeContainer<string>, name: string;
    let prefix: string;

    const filter_layers = json.layers.filter(
      (resource: Resource): boolean => {

        type = resource.resourceType;

        if (GMRTypePrefix.hasOwnProperty(type)) {

          name = resource.name;
          prefix = GMRTypePrefix[type];

          if (name.startsWith(prefix)) {

            result[type].push(resource);
            return false;
          }
        }

        return true;
      }
    );

    if (out_room_file_description) {

      if (typeof out_room_file_description === "string") {
        out_room_file_description = {
          name: out_room_file_description,
        }
      }

      const room_file_out = fl.prepare_path_file_yy(out_room_file_description.path ?? in_path_project, "rooms", out_room_file_description.name);

      json.layers = filter_layers;

      room_handler_prepare_json(json, {
        file_out: room_file_out,
        gm_vpath: out_room_file_description.gm_parent_path ?? default_gm_vpath
      });

      fs.writeFileSync(room_file_out, JSON.stringify(json));
    }
    return result;
  }

  return null;
}

export function room_handler(in_path_project: string, in_room_name: string, out_room_file_description?: Out): FilteredElements {
  const result = room_handler_filter(in_path_project, in_room_name, out_room_file_description);
  if (result) {
    return {
      assets: result[GMRType.ASSETS],
      instances: result[GMRType.INSTANCES],
    }
  }
  return null;
}

export function room_handler_codegen(in_path_project: string, in_room_name: string, out_room_file_description?: Out, tabs: number = 0): string {

  const result = room_handler_filter(in_path_project, in_room_name, out_room_file_description);
  if (result) {

    in_path_project = fl.prepare_path(in_path_project);

    const chunks: Buffer[] = [];

    const tabs_string: string = "\t".repeat(tabs);
    const push = (code: string): void => { chunks.push(Buffer.from(`${tabs_string}${code}\n`)); };

    const layers_asset: Resource[] = result[GMRType.ASSETS];
    const layers_instance: Resource[] = result[GMRType.INSTANCES];

    push("// #### auto code generate >>>");

    for (let layer of layers_asset) {

      for (let asset of layer.assets) {

        let x = asset.x;
        let y = asset.y;
        let x_scale = asset.scaleX;
        let y_scale = asset.scaleY;

        let sprite_name = asset.spriteId.name;
        let sprite_path = asset.spriteId.path;

        push(["Sprite: [", [x, y, x_scale, y_scale, sprite_name, sprite_path], "]"].toString());
      }
    }

    for (let layer of layers_instance) {

      for (let instance of layer.instances) {

        let x = instance.x;
        let y = instance.y;
        let x_scale = instance.scaleX;
        let y_scale = instance.scaleY;

        let object_name = instance.objectId.name;
        let object_path = instance.objectId.path;

        push(["Object: [", [x, y, x_scale, y_scale, object_name, object_path], "]"].toString());
      }
    }

    push("// #### auto code generate <<<");

    return Buffer.concat(chunks).toString();
  }
  return "";
}
