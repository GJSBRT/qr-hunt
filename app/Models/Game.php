<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use Searchable;

    const STATUS_DRAFT          = 'draft';
    const STATUS_NOT_STARTED    = 'not_started';
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
        'start_lat' => 'float',
        'start_lng' => 'float',
    ];

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function teams() {
        return $this->hasMany(Team::class, 'game_id', 'id');
    }

    public function qr_codes() {
        return $this->hasMany(QRCode::class, 'game_id', 'id');
    }

    public function powers() {
        return $this->hasMany(Power::class, 'game_id', 'id');
    }
}
