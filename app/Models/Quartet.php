<?php

namespace App\Models;

use App\Class\QuartetSettings;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Quartet extends Model
{
    protected $table = 'quartet';

    protected $fillable = [
        'qr_code_uuid',
        'category',
        'value',
    ];

    public $appends = [
        'color',
        'category_label'
    ];

    public function qr_code() {
        return $this->hasOne(QRCode::class, 'uuid', 'qr_code_uuid');
    }

    protected function color(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes): string {
                return QuartetSettings::CATEGORIES_AND_COLORS[$this->category];
            },
        );
    }

    protected function categoryLabel(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes): string {
                return QuartetSettings::CATEGORIES_AND_LABELS[$this->category];
            },
        );
    }
}
