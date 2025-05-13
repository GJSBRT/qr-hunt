<?php

namespace App\Class;

// Helper class to define a geo location
class GeoLocation {
    public function __construct(
        public float $lng = 0,
        public float $lat = 0,
    ) {}

    public function toArray() {
        return [
            'lng' => $this->lng,
            'lat' => $this->lat,
        ];
    }
}
