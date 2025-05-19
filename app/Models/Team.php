<?php

namespace App\Models;

use App\Traits\Searchable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
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

    public $appends = [
        'player_count',
    ];

    public function game() {
        return $this->hasOne(Game::class, 'id', 'game_id');
    }

    public function team_players() {
        return $this->hasMany(TeamPlayer::class, 'team_id', 'id');
    }

    public function team_points_modifiers() {
        return $this->hasMany(TeamPointsModifier::class, 'team_id', 'id');
    }

    protected function playerCount(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes): int {
                return $this->team_players()->count();
            },
        );
    }

    /**
     * Returns string if not allowed to scan containing the reason why. Return `null` is allowed to scan.
     */
    public function blockScanReason(): ?string {
        $uncompletedPowersCount = $this->team_qr_codes()->where('power_applied_to_team_id', $this->id)->where('power_completed_at', null)->count();
        if ($uncompletedPowersCount > 0) return "onvoltooide powers"; 

        $uncompletedScanFreeze = $this->team_scan_freezes()->where('starts_at', '<', Carbon::now())->where('ends_at', '>', Carbon::now())->first();
        if ($uncompletedScanFreeze) return "onvoltooide scan freezes. Verloopt op ".$uncompletedScanFreeze->ends_at->toDateTimeString();

        return null;
    }
}
