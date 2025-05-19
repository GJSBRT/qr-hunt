<?php

namespace App\GameModes\Territory\Models;

use Illuminate\Database\Eloquent\Model;

class TerritoryMissionMultipleChoiceAnswer extends Model
{
    protected $table = 'territory_mission_multiple_choice_answer';

    protected $fillable = [
        'territory_mission_id',
        'answer',
        'correct',
    ];

    public $hidden = [
        'correct'
    ];

    public $casts = [
        'correct' => 'boolean'
    ];

    public function territory_mission() {
        return $this->hasOne(TerritoryMission::class, 'id', 'territory_mission_id');
    }
}
