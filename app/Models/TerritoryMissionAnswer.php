<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TerritoryMissionAnswer extends Model
{
    protected $table = 'territory_mission_answer';

    protected $fillable = [
        'territory_mission_id',
        'team_id',
        'multiple_choice_id',
        'photo',
        'open_answer',
        'marked_correct',
    ];

    public $casts = [
        'marked_correct' => 'boolean'
    ];

    public function territory_mission() {
        return $this->hasOne(TerritoryMission::class, 'id', 'territory_mission_id');
    }

    public function multiple_choice() {
        return $this->hasOne(TerritoryMissionMultipleChoiceAnswer::class, 'id', 'multiple_choice_id');
    }

    public function team() {
        return $this->hasOne(Team::class, 'id', 'team_id');
    }
}
