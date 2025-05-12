<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Supplier
 * 
 * @property int $SupplierID
 * @property string $SupplierName
 * @property string|null $SupplierAddress
 * @property string|null $SupplierContact
 *
 * @package App\Models
 */
class Supplier extends Model
{
	protected $table = 'suppliers';
	protected $primaryKey = 'SupplierID';
	public $timestamps = false;

	protected $fillable = [
		'SupplierName',
		'SupplierAddress',
		'SupplierContact'
	];
}
