<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class PopularProduct
 * 
 * @property string|null $month
 * @property int $ProductID
 * @property string $productName
 * @property float|null $sold
 *
 * @package App\Models
 */
class PopularProduct extends Model
{
	protected $table = 'popular_products';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'ProductID' => 'int',
		'sold' => 'float'
	];

	protected $fillable = [
		'month',
		'ProductID',
		'productName',
		'sold'
	];
}
