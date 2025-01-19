import { DatabaseObject } from ".";

export interface Quartet extends DatabaseObject {
    qr_code_uuid: string;
    category: string;
    value: number;
    color: string;
    category_label: string;
};
