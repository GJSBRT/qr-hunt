import { GameMasterProps } from "@/types/game_master";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface GameMasterPage {
    name: string;
    label: string;
    icon: IconDefinition;
    element: (props: GameMasterProps) => JSX.Element;
}

export class GameMaster {
    public pages: GameMasterPage[] = [];

    constructor(...args: any) {}
}
