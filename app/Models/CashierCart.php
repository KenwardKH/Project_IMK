<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class CashierCart
 * 
 * @property int $CartID
 * @property int $CashierID
 * @property int $ProductID
 * @property int $Quantity
 * 
 * @property Kasir $kasir
 * @property Product $product
 *
 * @package App\Models
 */
class CashierCart extends Model
{
	protected $table = 'cashier_cart';
	protected $primaryKey = 'CartID';
	public $timestamps = false;

	protected $casts = [
		'CashierID' => 'int',
		'ProductID' => 'int',
		'Quantity' => 'int'
	];

	protected $fillable = [
		'CashierID',
		'ProductID',
		'Quantity'
	];

	public function kasir()
	{
		return $this->belongsTo(Kasir::class, 'CashierID');
	}

	public function product()
	{
		return $this->belongsTo(Product::class, 'ProductID');
	}
}
