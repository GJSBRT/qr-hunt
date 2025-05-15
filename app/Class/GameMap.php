<?php

namespace App\Class;

/**
 * This class holds configuration information about the game map.
 */
class GameMap {
    const DEFAULT_PLAYER_LOCATION_MARKER_COLOR = '#2563eb';

    public function __construct(
        protected bool $showPlayerLocation = true,
        protected string $playerLocationColor = self::DEFAULT_PLAYER_LOCATION_MARKER_COLOR,
        protected bool $shareLocationDataToServer = false,
        protected array $playersWhichCanViewOthersLocations = [], 
        protected ?GeoLocation $startLocationMarker = null, // Long, lat in array
        protected array $areas = [], // array of GameMapArea
    ) {}

    public function updatePlayersWhichCanViewOthersLocations(array $players) {
        $this->playersWhichCanViewOthersLocations = $players;
    }

    public function toArray() {
        return [
            'showPlayerLocation' => $this->showPlayerLocation,
            'playerLocationColor' => $this->playerLocationColor,
            'shareLocationDataToServer' => $this->shareLocationDataToServer,
            'startLocationMarker' => $this->startLocationMarker,
            'areas' => $this->areas,
        ];
    }

    /**
     * Get an area by it's unique id.
     */
    public function getAreaById(string $areaId): GameMapArea|null {
        foreach($this->areas as $area) {
            if ($area->id == $areaId) {
                return $area;
            }
        }

        return null;
    }
}
