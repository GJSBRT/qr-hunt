<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TerritoryTag extends Model
{
    protected $table = 'territory_tag';

    protected $fillable = [
        'territory_id',
        'team_id',
    ];

    public function territory() {
        return $this->hasOne(Territory::class, 'id', 'territory_id');
    }

    public function team() {
        return $this->hasOne(Team::class, 'id', 'team_id');
    }
}
