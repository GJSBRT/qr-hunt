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
        'game_mode',
        'name',
        'code',
        'status',
        'started_at',
        'ended_at',
        'play_duration',
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
    ];

    public $casts = [
        'started_at'    => 'datetime',
        'ended_at'      => 'datetime',
        'show_results'  => 'boolean',
    ];

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function territory() {
        return $this->hasOne(Territory::class, 'game_id', 'id');
    }

    public function powers() {
        return $this->hasMany(Power::class, 'game_id', 'id');
    }

    public function teams() {
        return $this->hasMany(Team::class, 'game_id', 'id');
    }

    public function team_players() {
        return $this->hasManyThrough(TeamPlayer::class, Team::class, 'game_id', 'team_id', 'id', 'id');
    }
}
