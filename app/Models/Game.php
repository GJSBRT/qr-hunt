<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use Searchable;

    const STATUS_DRAFT          = 'draft';
    const STATUS_NOT_STARTED    = 'not_started';
    const STATUS_STARTING       = 'starting';
    const STATUS_STARTED        = 'started';
    const STATUS_ENDED          = 'ended';

    protected $table = 'game';

    protected $fillable = [
        'user_id',
        'name',
        'code',
        'status',
        'started_at',
        'ended_at',
        'play_duration',
        'cooldown_duration',
        'start_lat',
        'start_lng',
        'quartet_categories',
        'quartet_values',
        'show_results',
    ];

    public $searchable = [
        'name',
        'code',
    ];

    public $sortable = [
        'id',
        'name',
        'code',
        'status',
        'started_at',
        'ended_at',
        'play_duration',
        'cooldown_duration',
        'quartet_categories',
        'quartet_values',
    ];

    public $casts = [
        'started_at'    => 'datetime',
        'ended_at'      => 'datetime',
        'start_lat'     => 'float',
        'start_lng'     => 'float',
        'show_results'  => 'boolean',
    ];

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function teams() {
        return $this->hasMany(Team::class, 'game_id', 'id');
    }

    public function team_players() {
        return $this->hasManyThrough(TeamPlayer::class, Team::class, 'game_id', 'team_id', 'id', 'id');
    }

    public function qr_codes() {
        return $this->hasMany(QRCode::class, 'game_id', 'id');
    }

    public function powers() {
        return $this->hasMany(Power::class, 'game_id', 'id');
    }

    public function getResults(): array {
        $teamPoints = [];
        foreach($this->teams()->get() as $team) {
            $points = 0;

            $sets = [];
            foreach($team->team_qr_codes()->with(['qr_code' => ['power', 'quartet']])->get() as $teamQRcode) {
                if (!$teamQRcode->qr_code->quartet) continue;

                $points++;
                if (isset($sets[$teamQRcode->qr_code->quartet->category])) {
                    $sets[$teamQRcode->qr_code->quartet->category]++;
                } else {
                    $sets[$teamQRcode->qr_code->quartet->category] = 1;
                }
            }

            // Add bonus points for each completed set.
            foreach($sets as $set) {
                if ($set != $this->quartet_values) continue;
                $points += 2;
            }

            $pointsModifiers = $team->team_points_modifiers()->get();
            foreach($pointsModifiers as $pointsModifier) {
                $points = $pointsModifier->modifyPoints($points);
            }

            $teamPoints[$points] = [
                'team'      => $team,
                'points'    => $points
            ];
        }

        krsort($teamPoints);

        return $teamPoints;
    }
}
