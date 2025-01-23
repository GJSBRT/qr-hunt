<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamQRCode extends Model
{
    protected $table = 'team_qr_code';

    protected $fillable = [
        'qr_code_uuid',
        'team_id',
        'team_player_id',
        'power_used_at',
        'transferred_from_team_id',
        'power_completed_at',
        'power_applied_to_team_id',
    ];

    public $casts = [
        'power_used_at'         => 'datetime',
        'power_completed_at'    => 'datetime',
    ];

    public function team() {
        return $this->hasOne(Team::class, 'id', 'team_id');
    }

    public function transferred_from_team() {
        return $this->hasOne(Team::class, 'id', 'transferred_from_team_id');
    }

    public function team_player() {
        return $this->hasOne(TeamPlayer::class, 'id', 'team_player_id');
    }

    public function qr_code() {
        return $this->hasOne(QRCode::class, 'uuid', 'qr_code_uuid');
    }

    public function power() {
        return $this->hasOneThrough(Power::class, QRCode::class, 'uuid', 'id', 'qr_code_uuid', 'power_id');
    }

    public function power_applied_to_team() {
        return $this->hasOne(Team::class, 'id', 'power_applied_to_team_id');
    }

    public function quartet() {
        return $this->hasOne(Quartet::class, 'qr_code_uuid', 'qr_code_uuid');
    }
}
