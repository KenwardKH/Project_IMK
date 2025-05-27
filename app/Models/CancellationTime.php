<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CancellationTime extends Model
{
    protected $table = 'cancellationtime';

    protected $fillable = [
        'paymentTime',
    ];

    protected $casts = [
        'paymentTime' => 'float',
    ];

    /**
     * Get the payment timeout in hours.
     */
    public function getTimeoutInHoursAttribute(): float
    {
        return $this->paymentTime ?? 48.0;
    }

    /**
     * Get the latest cancellation time setting.
     */
    public static function getLatest(): ?self
    {
        return static::orderByDesc('id')->first();
    }

    /**
     * Get the current timeout in hours from the latest setting.
     */
    public static function getCurrentTimeoutHours(): float
    {
        return static::getLatest()?->timeout_in_hours ?? 48.0;
    }

    /**
     * Create or update the cancellation time setting.
     */
    public static function setGlobalTimeout(float $hours): self
    {
        $setting = static::firstOrNew([]);
        $setting->paymentTime = round($hours, 2);
        $setting->save();

        return $setting;
    }
}
