<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamScanFreeze extends Model
{
    protected $table = 'team_scan_freeze';

    protected $fillable = [
        'team_id',
        'starts_at',
        'ends_at',
    ];

    public $casts = [
        'starts_at' => 'datetime',
        'ends_at'   => 'datetime',
    ];

    public function team() {
        return $this->hasOne(Team::class, 'id', 'team_id');
    }
}
