<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class CustomerCart
 * 
 * @property int $CartID
 * @property int $CustomerID
 * @property int $ProductID
 * @property int $Quantity
 * 
 * @property Customer $customer
 * @property Product $product
 *
 * @package App\Models
 */
class CustomerCart extends Model
{
	protected $table = 'customer_cart';
	protected $primaryKey = 'CartID';
	public $timestamps = false;

	protected $casts = [
		'CustomerID' => 'int',
		'ProductID' => 'int',
		'Quantity' => 'int'
	];

	protected $fillable = [
		'CustomerID',
		'ProductID',
		'Quantity'
	];

	public function customer()
	{
		return $this->belongsTo(Customer::class, 'CustomerID');
	}

	public function product()
	{
		return $this->belongsTo(Product::class, 'ProductID');
	}
}
