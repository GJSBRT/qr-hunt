import { TeamScore } from "./events";
import { Game, GameMode } from "./game";
import { Team, TeamPlayer } from "./team";

export interface GameMasterProps {
    game: Game & {
        teams: Array<Team & {
            team_players: TeamPlayer[];
        }>;
    };
    gameMode: GameMode;
    results: TeamScore[];
}
