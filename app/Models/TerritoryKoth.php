<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TerritoryKoth extends Model
{
    protected $table = 'territory_koth';

    protected $fillable = [
        'territory_id',
        'lat',
        'lng',
    ];

    public function territory() {
        return $this->hasOne(Territory::class, 'id', 'territory_id');
    }

    public function claims() {
        return $this->hasMany(TerritoryKothClaim::class, 'territory_koth_id', 'id');
    }
}
