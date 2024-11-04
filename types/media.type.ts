import { Timestamps } from "./commons.type";

export interface Media extends Timestamps {
    id: number;
    type: string;
    file_path: string;
    mediable_type: string;
    mediable_id: number;
    full_url: string;
}