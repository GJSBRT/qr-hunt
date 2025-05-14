<?php

namespace App\Class;

/**
 * This class represents an area on the map.
 */
class GameMapArea {
    public function __construct(
        public array $geoLocations = [],
        public string $name = '',
        public bool $displayName = false,
        public string $color = 'green',
        public string $type = 'polygon',
        public int $radius = 0,
        public float $opacity = 1,
        public string $gameType = '', // A type specific to the game mode.
        public array $metadata = [],
    ) {}

    public function toArray() {
        return [
            'geoLocations' => $this->geoLocations,
            'name' => $this->name,
            'displayName' => $this->displayName,
            'color' => $this->color,
            'type' => $this->type,
            'radius' => $this->radius,
            'opacity' => $this->opacity,
        ];
    }
}
