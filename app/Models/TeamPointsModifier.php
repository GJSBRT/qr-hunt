<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamPointsModifier extends Model
{
    const TYPE_ADD      = 'add';
    const TYPE_REMOVE   = 'remove';

    protected $table = 'team_points_modifier';

    protected $fillable = [
        'team_id',
        'type',
        'amount',
    ];

    public function team() {
        return $this->hasOne(Team::class, 'id', 'team_id');
    }

    public function modifyPoints(int $points): int {
        switch ($this->type) {
            case self::TYPE_ADD:
                return $points + $this->amount;
            case self::TYPE_REMOVE:
                if ($points <= $this->amount) {
                    return 0;
                }

                return $points - $this->amount;
        }

        return $points;
    }
}
