<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Model;

class TeamPlayer extends Model
{
    use Searchable;

    protected $table = 'team_player';

    protected $fillable = [
        'team_id',
        'name',
    ];

    public $searchable = [
        'name',
    ];

    public function team() {
        return $this->hasOne(Team::class, 'id', 'team_id');
    }
}
