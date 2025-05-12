<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class User
 * 
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $role
 * 
 * @property Collection|Customer[] $customers
 * @property Collection|Kasir[] $kasirs
 * @property Collection|Session[] $sessions
 *
 * @package App\Models
 */
class User extends Model
{
	protected $table = 'users';

	protected $casts = [
		'email_verified_at' => 'datetime'
	];

	protected $hidden = [
		'password',
		'remember_token'
	];

	protected $fillable = [
		'name',
		'email',
		'email_verified_at',
		'password',
		'remember_token',
		'role'
	];

	public function customers()
	{
		return $this->hasMany(Customer::class);
	}

	public function kasirs()
	{
		return $this->hasMany(Kasir::class);
	}

	public function sessions()
	{
		return $this->hasMany(Session::class);
	}
}
