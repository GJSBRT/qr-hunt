<?php

namespace App\Models;

use App\Traits\Searchable;
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

    public function team_qr_codes() {
        return $this->hasMany(TeamQRCode::class, 'team_id', 'id');
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
}
