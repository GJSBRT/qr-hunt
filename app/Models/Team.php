<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use Searchable;

    protected $table = 'team';

    protected $fillable = [
        'game_id',
        'name',
    ];

    public $searchable = [
        'name',
    ];

    public function game() {
        return $this->hasOne(Game::class, 'id', 'game_id');
    }
}
