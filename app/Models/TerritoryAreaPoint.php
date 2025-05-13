<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TerritoryAreaPoint extends Model
{
    protected $table = 'territory_area_point';

    protected $fillable = [
        'territory_area_id',
        'lat',
        'lng',
    ];

    public $casts = [
        'lat' => 'float',
        'lng' => 'float'
    ];

    public function territory_area() {
        return $this->hasOne(TerritoryArea::class, 'id', 'territory_area_id');
    }
}
