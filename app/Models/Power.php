<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Model;

class Power extends Model
{
    const TYPE_MESSAGE                  = 'message'; // Notify team of a message when power up is used. Can be used for custom power ups.
    const TYPE_WILDCARD                 = 'wildcard'; // If a sets is missing a single card to be completed, then this card will be used to complete the set.
    const TYPE_QR_LOCATION_HINT         = 'qr_location_hint'; // Shows the team a hint of a undiscovered QR code location.
    const TYPE_SCAN_FREEZE              = 'scan_freeze'; // Stops the team from scanning QR codes for a period of time.
    const TYPE_RETURN_TO_START          = 'return_to_start'; // Requires the team to go to the starting area before scanning another QR code.
    const TYPE_GIVE_QR_TO_ANOTHER_TEAM  = 'give_qr_to_another_team'; // Requires the team to give a QR code to another team.

    const TYPES_AND_LABELS = [
        self::TYPE_MESSAGE => 'Bericht - laat een bericht zien aan een team.',
        self::TYPE_WILDCARD => 'Joker kaart - als een team een setje heeft met een missende kaart, dan wordt deze joker gebruikt om het setje compleet te maken.',
        self::TYPE_QR_LOCATION_HINT => 'QR Code locatie hint - laat het team een hint zien van waar een QR code bevindt.',
        self::TYPE_SCAN_FREEZE => 'Scan freeze - het team kan voor een bepaalde tijd geen QR codes scannen.',
        self::TYPE_RETURN_TO_START => 'Terug naar start - het team moet eerst terug naar de start plek om weer een QR code te scannen.',
        self::TYPE_GIVE_QR_TO_ANOTHER_TEAM => 'Geef een QR code aan een ander team - het team moet verplicht een willekeurige QR code aan een ander team geven.',
    ];

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
