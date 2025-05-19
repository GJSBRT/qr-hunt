<?php

namespace App\GameModes\Territory\Models;

use App\Models\Game;
use Illuminate\Database\Eloquent\Model;

class Territory extends Model
{
    protected $table = 'territory_game';

    protected $fillable = [
        'game_id',
        'points_per_claimed_area',
        'start_lat',
        'start_lng',
    ];

    public $casts = [
        'start_lat' => 'float',
        'start_lng' => 'float'
    ];

    public function game() {
        return $this->hasOne(Game::class, 'id', 'game_id');
    }

    public function territory_areas() {
        return $this->hasMany(TerritoryArea::class, 'territory_id', 'id');
    }

    public function territory_tags() {
        return $this->hasMany(TerritoryTag::class, 'territory_id', 'id');
    }

    public function territory_missions() {
        return $this->hasMany(TerritoryMission::class, 'territory_id', 'id');
    }

    public function territory_mission_answers() {
        return $this->hasManyThrough(TerritoryMissionAnswer::class, TerritoryMission::class, 'territory_id', 'territory_mission_id', 'id', 'id');
    }

    public function territory_koths() {
        return $this->hasMany(TerritoryKoth::class, 'territory_id', 'id');
    }
}
