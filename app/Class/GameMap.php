<?php

namespace App\Class;

/**
 * This class holds configuration information about the game map.
 */
class GameMap {
    public function __construct(
        protected bool $showPlayerLocation = true,
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
