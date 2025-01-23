<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Model;

class GameMapAreaPoint extends Model
{
    use Searchable;

    protected $table = 'game_map_area_point';

    protected $fillable = [
        'game_id',
        'lat',
        'lng',
    ];

    public function game() {
        return $this->hasOne(Game::class, 'id', 'game_id');
    }
}
