import { IClickable } from "./clickable";

export interface Model
{
    path: string;
    normal: {x: number, y: number, z: number};
    clickables: IClickable[];
}