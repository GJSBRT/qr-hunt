<?php

namespace App\Class\GameModes\Territory\Models;

use App\Models\Team;
use Illuminate\Database\Eloquent\Model;

class TerritoryKothClaim extends Model
{
    protected $table = 'territory_koth_claim';

    protected $fillable = [
        'territory_koth_id',
        'claim_team_id',
        'claimed_at',
    ];

    public $casts = [
        'claimed_at' => 'datetime'
    ];

    public function territory_koth() {
        return $this->hasOne(TerritoryKoth::class, 'id', 'territory_koth_id');
    }

    public function claim_team() {
        return $this->hasOne(Team::class, 'id', 'claim_team_id');
    }
}
