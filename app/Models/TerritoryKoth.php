<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TerritoryKoth extends Model
{
    protected $table = 'territory_koth';

    protected $fillable = [
        'territory_id',
        'claim_team_id',
        'claimed_at',
        'lat',
        'lng',
    ];

    public function territory() {
        return $this->hasOne(Territory::class, 'id', 'territory_id');
    }

    public function claim_team() {
        return $this->hasOne(Team::class, 'id', 'claim_team_id');
    }
}
