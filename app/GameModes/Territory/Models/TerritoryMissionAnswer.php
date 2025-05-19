<?php

namespace App\GameModes\Territory\Models;

use App\Models\Team;
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
        'territory_area_id',
    ];

    public $casts = [
        'marked_correct' => 'boolean'
    ];

    public function territory_mission() {
        return $this->hasOne(TerritoryMission::class, 'id', 'territory_mission_id');
    }

    public function territory_area() {
        return $this->hasOne(TerritoryArea::class, 'id', 'territory_area_id');
    }

    public function multiple_choice() {
        return $this->hasOne(TerritoryMissionMultipleChoiceAnswer::class, 'id', 'multiple_choice_id');
    }

    public function team() {
        return $this->hasOne(Team::class, 'id', 'team_id');
    }
}
