<?php

namespace App\Class;

class GameMapArea {
    public function __construct(
        public array $geoLocations = [],
        public string $name = '',
        public bool $displayName = false,
        public string $color = 'green',
        public string $type = 'polygon',
        public int $radius = 0,
        public float $opacity = 1,
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
