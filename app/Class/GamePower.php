<?php

namespace App\Class;

use App\Models\Power;

class GamePower {
    public function __construct(
        public Power $power,
        public $onApplied = null,
    ) {}

    public function toArray() {
        return [
            ...$this->power->toArray(),
        ];
    }
}
