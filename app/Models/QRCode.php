<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use SimpleSoftwareIO\QrCode\Facades\QrCode as FacadesQrCode;

class QRCode extends Model
{
    const MARKER = '!!QRH!!';

    use HasUuids;
    use Searchable;

    protected $primaryKey = 'uuid';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $table = 'qr_code';

    protected $fillable = [
        'uuid',
        'game_id',
        'power_id',
        'description',
        'max_scans',
        'location_lat',
        'location_lng',
    ];

    public $searchable = [
        'description',
        'location_lat',
        'location_lng',
        'quartet.category',
    ];

    public function game() {
        return $this->hasOne(Game::class, 'id', 'game_id');
    }

    public function team_qr_codes() {
        return $this->hasMany(TeamQRCode::class, 'qr_code_uuid', 'uuid');
    }

    public function power() {
        return $this->hasOne(Power::class, 'id', 'power_id');
    }

    public function quartet() {
        return $this->hasOne(Quartet::class, 'qr_code_uuid', 'uuid');
    }

    public function generateImage() {
        $game = $this->game()->first();

        $data = 'Dit is een QR code voor het spel QR hunt.\n';
        $data .= self::MARKER.base64_encode(json_encode([
            'uuid' => $this->uuid
        ])).self::MARKER;

        return FacadesQrCode::format('png')
            ->size(1024)
            ->errorCorrection('M')
            ->generate($data)->toHtml();
    }
}
