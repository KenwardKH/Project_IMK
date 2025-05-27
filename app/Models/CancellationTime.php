<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CancellationTime extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'cancellationtime';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'paymentTime',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'paymentTime' => 'datetime:H:i:s',
    ];

    /**
     * Get the payment timeout in hours.
     * Converts the TIME field to hours for easier calculation.
     *
     * @return float
     */
    public function getTimeoutInHoursAttribute()
    {
        if (!$this->paymentTime) {
            return 48; // Default 48 hours
        }

        $time = \Carbon\Carbon::parse($this->paymentTime);
        return $time->hour + ($time->minute / 60);
    }

    /**
     * Get the latest cancellation time setting.
     *
     * @return CancellationTime|null
     */
    public static function getLatest()
    {
        return static::orderBy('id', 'desc')->first();
    }

    /**
     * Get the current timeout in hours from the latest setting.
     *
     * @return float
     */
    public static function getCurrentTimeoutHours()
    {
        $latest = static::getLatest();
        return $latest ? $latest->timeout_in_hours : 48;
    }

    /**
     * Set the payment time using hours.
     * Converts hours to TIME format for database storage.
     *
     * @param float $hours
     * @return void
     */
    public function setTimeoutHours($hours)
    {
        $wholeHours = floor($hours);
        $minutes = ($hours - $wholeHours) * 60;
        
        $this->paymentTime = sprintf('%02d:%02d:00', $wholeHours, $minutes);
    }

    /**
     * Create or update the cancellation time setting.
     *
     * @param float $hours
     * @return CancellationTime
     */
    public static function setGlobalTimeout($hours)
    {
        $cancellationTime = new static();
        $cancellationTime->setTimeoutHours($hours);
        $cancellationTime->save();
        
        return $cancellationTime;
    }
}