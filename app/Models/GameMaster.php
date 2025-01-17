<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Model;

class GameMaster extends Model
{
    use Searchable;

    protected $table = 'game_master';

    protected $fillable = [
        'user_id',
        'game_id',
    ];

    public function game() {
        return $this->hasOne(Game::class, 'id', 'game_id');
    }

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
