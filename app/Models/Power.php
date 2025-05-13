<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Model;

class Power extends Model
{
    const TYPE_NO_ACTION                    = 'no_action'; // Does nothing
    const TYPE_MESSAGE                      = 'message'; // Notify team of a message when power up is used. Can be used for custom power ups.
    const TYPE_GIVE_POWER_TO_ANOTHER_TEAM   = 'give_power_to_another_team'; // Requires a team to give up one of their powers if they have any.
    const TYPE_RECEIVE_POWER_FROM_TEAM      = 'receive_power_from_team'; // Requires a specific team selected by the using team to give them one of their powers.
    const TYPE_TAKE_POWER_FROM_TEAM         = 'take_power_from_team'; // Lets the using team take a specfic power from another team.
    const TYPE_RETURN_TO_START              = 'return_to_start'; // Requires the team to go to the starting area before continuing.

    const TYPE_LABELS = [
        self::TYPE_NO_ACTION => 'Geen actie - doe helemaal niks.',
        self::TYPE_MESSAGE => 'Bericht - laat een bericht zien aan een team.',
        self::TYPE_GIVE_POWER_TO_ANOTHER_TEAM => 'Geef power aan een ander team - als geselecteerd team ben je dan verplicht om een van je power weg te geven.',
        self::TYPE_RECEIVE_POWER_FROM_TEAM => 'Krijg een power van een team - als geselecteerd team ben je verplicht een kaart te geven aan het team wat de power gebruikte.',
        self::TYPE_TAKE_POWER_FROM_TEAM => 'Pak een power van een team - als team kan je dan een power pakken van een team.',
        self::TYPE_RETURN_TO_START => 'Terug naar start - het team moet eerst terug naar de start plek om weer veder te gaan.',
    ];

    use Searchable;

    protected $table = 'power';

    protected $fillable = [
        'game_id',
        'owner_team_id',
        'used_on_team_id',
        'power_up',
        'description',
        'applies_to_other_team',
        'type',
        'description',
        'extra_fields',
        'claimed_at',
        'used_at',
    ];

    public $searchable = [
        'type',
    ];

    public $casts = [
        'applies_to_other_team' => 'boolean',
        'power_up'              => 'boolean',
        'used_at'               => 'datetime',
        'extra_fields'          => 'array',
    ];

    public function game() {
        return $this->hasOne(Game::class, 'id', 'game_id');
    }

    public function owner_team() {
        return $this->hasOne(Team::class, 'id', 'owner_team_id');
    }

    public function used_on_team() {
        return $this->hasOne(Team::class, 'id', 'used_on_team_id');
    }
}