import { room_handler_codegen } from "../src/RoomHandler/oeRoomHandler";
import { load_sprite, load_sprite_from_object } from "../src/RoomHandler/hook_sprites/hook_sprites";

const in_path_project = "C:\\Users\\lowLord\\Desktop\\OERoomHandler\\test_gms\\Room";
const in_room_name = "Room_test_child";

const out_file = "Room_test_filter";


const sprite = load_sprite_from_object(in_path_project, "obj_test");
console.log(sprite);



//const result = room_handler_codegen(in_path_project, in_room_name, out_file);
//console.log(result);
