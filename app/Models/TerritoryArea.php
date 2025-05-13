<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TerritoryArea extends Model
{
    protected $table = 'territory_area';

    protected $fillable = [
        'territory_id',
        'claim_team_id',
        'name',
    ];

    public function territory() {
        return $this->hasOne(Territory::class, 'id', 'territory_id');
    }

    public function territory_area_points() {
        return $this->hasOne(TerritoryAreaPoint::class, 'territory_area_id', 'id');
    }
}
