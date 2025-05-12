<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Pricing
 * 
 * @property int $PriceID
 * @property int|null $ProductID
 * @property float $UnitPrice
 * 
 * @property Product|null $product
 *
 * @package App\Models
 */
class Pricing extends Model
{
	protected $table = 'pricing';
	protected $primaryKey = 'PriceID';
	public $timestamps = false;

	protected $casts = [
		'ProductID' => 'int',
		'UnitPrice' => 'float'
	];

	protected $fillable = [
		'ProductID',
		'UnitPrice'
	];

	public function product()
	{
		return $this->belongsTo(Product::class, 'ProductID');
	}
}
