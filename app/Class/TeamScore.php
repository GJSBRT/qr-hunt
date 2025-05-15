<?php

namespace App\Class;

use App\Models\Team;

/**
 * Team scores defines the structure for a team's score
 */
class TeamScore {
    public function __construct(
        public Team $team,
        public int $score,
    ) {}
}
