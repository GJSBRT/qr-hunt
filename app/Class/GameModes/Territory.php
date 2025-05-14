<?php

namespace App\Class\GameModes;

use App\Class\GameAction;
use App\Class\GameMap;
use App\Class\GameMapArea;
use App\Class\GeoLocation;
use App\Class\GameMode;
use App\Class\GameState;
use App\Exceptions\GameModeException;
use App\Models\Team;
use App\Models\TeamPlayer;
use App\Models\Territory as ModelsTerritory;

class Territory extends GameMode {
    const GAME_MODE_TYPE = 'territory';
    const GAME_MODE_LABEL = 'Territory';

    const GAME_MAP_AREA_TYPE_CHALLENGE = 'challenge';
    const GAME_MAP_AREA_TYPE_KOTH = 'koth';

    public function __construct(
        ModelsTerritory $territory,
    ) {
        $this->gameMode = self::GAME_MODE_TYPE;
        $this->gameDescriptionHtml = <<<HTML
            <h2>Spel regels</h2>
            <ul>
                <li>
                    Iedereen wordt in teams verdeeld en een gebied ook. Het doel is om als team zo veel mogelijke delen geclaimed te hebben. Om een deel te claimen moet je een korte opdracht doen binnen het deel. Als een deel geclaimd is door een team kunnen andere teams dat deel nogsteeds claimen.
                </li>

                <li>
                    In het midden van de binnenstad is er een glazen engel. Deze engel kan geclaimed worden. Wanneer deze geclaimed is krijgt het team voor elke 5 minuten een extra bonus punt. Wanneer deze geclaimed is krijgen alle teams hier bericht van.
                </li>

                <li>
                    Er is telkens ook een team een tikker. Dit team mag geen delen claimen en moet eerst een persoon van een ander team tikken, waardoor dit team de tikker wordt. De tikker krijgt de locaties te zien van alle teams. De tikker mag niet terug tikken.
                </li>

                <li>
                    Teams mogen niet splitsen.
                </li>

                <li>
                    Op bepaalde plekken kan je power up/downs krijgen. Deze kunnen maar door een team gepakt worden.
                </li>
            </ul>
        HTML;

        $territory = ModelsTerritory::where('id', $territory->id)->with([
            'territory_areas',
            'territory_koths',
        ])->first();
        if (!$territory) {
            throw new GameModeException("Could not get territory from database.");
        }

        $this->game = $territory->game()->first();
        if (!$this->game) {
            throw new GameModeException("Could not get game from database.");
        }

        // Set location marker
        $startLocationMarker = null;
        if ($territory->start_lat && $territory->start_lng) {
            $startLocationMarker = new GeoLocation($territory->start_lng, $territory->start_lat);
        }

        // Set map areas
        $areas = [];
        foreach($territory->territory_areas as $territoryArea) {
            $geoLocations = [];
            foreach($territoryArea->territory_area_points()->get() as $point) {
                $geoLocations[] = new GeoLocation($point->lng, $point->lat);
            }

            $areas[] = new GameMapArea(
                name: $territoryArea->name,
                geoLocations: $geoLocations,
                opacity: 0.2,
                gameType: self::GAME_MAP_AREA_TYPE_CHALLENGE,
            );
        }

        foreach($territory->territory_koths as $idx => $territoryKoth) {
            $areas[] = new GameMapArea(
                name: 'Koth #' . $idx + 1, // TODO: add in db
                geoLocations: [(new GeoLocation($territoryKoth->lng, $territoryKoth->lat))],
                radius: 10,
                type: 'circle',
                opacity: 0.2,
                gameType: self::GAME_MAP_AREA_TYPE_KOTH,
            );
        }

        $this->gameMap = new GameMap(
            showPlayerLocation: true,
            shareLocationDataToServer: true,
            playersWhichCanViewOthersLocations: [],
            startLocationMarker: $startLocationMarker,
            areas: $areas,
        );

        $this->gameActions = [
            "claim_koth" => new GameAction("claim_koth", function(GameState $gameState) {
                dd($gameState);
            }),
        ];
    }

    public function getTeamData(Team $team): array {
        return [
            ...parent::getTeamData($team),
        ];
    }
}
