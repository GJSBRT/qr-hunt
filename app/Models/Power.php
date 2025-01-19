<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Model;

class Power extends Model
{
    const TYPE_MESSAGE = 'message'; // Notify team of a message when power up is used. Can be used for custom power ups.

    use Searchable;

    protected $table = 'power';

    protected $fillable = [
        'game_id',
        'power_up',
        'description',
        'related_to_other_team',
        'type',
        'extra_fields',
    ];

    public $searchable = [
        'type',
    ];

    public $casts = [
        'related_to_other_team' => 'boolean',
        'power_up'              => 'boolean',
        'used_at'               => 'datetime',
        'extra_fields'          => 'array',
    ];

    public function game() {
        return $this->hasOne(Game::class, 'id', 'game_id');
    }

    public function qr_code() {
        return $this->hasOne(QRCode::class, 'uuid', 'qr_code_uuid');
    }

    public function used_team() {
        return $this->hasOne(Team::class, 'id', 'used_team_id');
    }
}
