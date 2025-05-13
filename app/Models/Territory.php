<?php

namespace App\Models;

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
}
