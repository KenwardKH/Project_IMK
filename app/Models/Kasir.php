<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Kasir
 * 
 * @property int $id_kasir
 * @property int $user_id
 * @property string $nama_kasir
 * @property string|null $alamat_kasir
 * @property string|null $kontak_kasir
 * 
 * @property User $user
 * @property Collection|CashierCart[] $cashier_carts
 *
 * @package App\Models
 */
class Kasir extends Model
{
	protected $table = 'kasir';
	protected $primaryKey = 'id_kasir';
	public $timestamps = false;

	protected $casts = [
		'user_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'nama_kasir',
		'alamat_kasir',
		'kontak_kasir'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function cashier_carts()
	{
		return $this->hasMany(CashierCart::class, 'CashierID');
	}
}
