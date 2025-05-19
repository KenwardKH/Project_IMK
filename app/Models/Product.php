<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Product
 * 
 * @property int $ProductID
 * @property string $ProductName
 * @property string|null $Description
 * @property string $ProductUnit
 * @property int|null $CurrentStock
 * @property string|null $image
 * 
 * @property Collection|CashierCart[] $cashier_carts
 * @property Collection|CustomerCart[] $customer_carts
 * @property Collection|Pricing[] $pricings
 *
 * @package App\Models
 */
class Product extends Model
{
	protected $table = 'products';
	protected $primaryKey = 'ProductID';
	public $timestamps = false;

	protected $casts = [
		'CurrentStock' => 'int'
	];

	protected $fillable = [
		'ProductName',
		'Description',
		'ProductUnit',
		'CurrentStock',
		'ProductPrice',
		'image'
	];

	public function cashier_carts()
	{
		return $this->hasMany(CashierCart::class, 'ProductID');
	}

	public function customer_carts()
	{
		return $this->hasMany(CustomerCart::class, 'ProductID');
	}
	public function price_history()
	{
		return $this->hasMany(PricingLog::class, 'ProductID')
            ->orderBy('TimeChanged', 'desc');
	}
}
