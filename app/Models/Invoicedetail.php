<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Invoicedetail
 * 
 * @property int $DetailID
 * @property int|null $InvoiceID
 * @property int $ProductID
 * @property string $productName
 * @property string $productImage
 * @property int $Quantity
 * @property string $productUnit
 * @property string $price
 * 
 * @property Invoice|null $invoice
 *
 * @package App\Models
 */
class Invoicedetail extends Model
{
	protected $table = 'invoicedetails';
	protected $primaryKey = 'DetailID';
	public $timestamps = false;

	protected $casts = [
		'InvoiceID' => 'int',
		'ProductID' => 'int',
		'Quantity' => 'int'
	];

	protected $fillable = [
		'InvoiceID',
		'ProductID',
		'productName',
		'productImage',
		'Quantity',
		'productUnit',
		'price'
	];

	public function invoice()
	{
		return $this->belongsTo(Invoice::class, 'InvoiceID');
	}
}
