<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Customer
 * 
 * @property int $CustomerID
 * @property int $user_id
 * @property string $CustomerName
 * @property string|null $CustomerAddress
 * @property string|null $CustomerContact
 * 
 * @property User $user
 * @property Collection|CustomerCart[] $customer_carts
 *
 * @package App\Models
 */
class Customer extends Model
{
	protected $table = 'customers';
	protected $primaryKey = 'CustomerID';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'CustomerName',
		'CustomerAddress',
		'CustomerContact'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function customer_carts()
	{
		return $this->hasMany(CustomerCart::class, 'CustomerID');
	}
}
