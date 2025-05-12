<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PricingLog
 * 
 * @property int $id
 * @property int $ProductID
 * @property float $OldPrice
 * @property float $NewPrice
 * @property Carbon $TimeChanged
 *
 * @package App\Models
 */
class PricingLog extends Model
{
	protected $table = 'pricing_logs';
	public $timestamps = false;

	protected $casts = [
		'ProductID' => 'int',
		'OldPrice' => 'float',
		'NewPrice' => 'float',
		'TimeChanged' => 'datetime'
	];

	protected $fillable = [
		'ProductID',
		'OldPrice',
		'NewPrice',
		'TimeChanged'
	];
}
