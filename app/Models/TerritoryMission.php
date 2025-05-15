<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TerritoryMission extends Model
{
    const ANSWER_TYPE_MULTIPLE_CHOICE = 'multiple_choice';
    const ANSWER_TYPE_OPEN_ANSWER = 'open_answer';
    const ANSWER_TYPE_PHOTO = 'photo';

    protected $table = 'territory_mission';

    protected $fillable = [
        'territory_id',
        'title',
        'description',
        'answer_type',
    ];

    public function territory() {
        return $this->hasOne(Territory::class, 'id', 'territory_id');
    }

    public function multiple_choices() {
        return $this->hasMany(TerritoryMissionMultipleChoiceAnswer::class, 'territory_mission_id', 'id');
    }

    public function answers() {
        return $this->hasMany(TerritoryMissionAnswer::class, 'territory_mission_id', 'id');
    }
}
