<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class SupplyInvoiceDetail
 * 
 * @property int $SupplyInvoiceDetailId
 * @property int $SupplyInvoiceId
 * @property int|null $ProductID
 * @property string $ProductName
 * @property int $Quantity
 * @property string $productUnit
 * @property float $SupplyPrice
 * @property string $discount
 * @property float $FinalPrice
 * 
 * @property SupplyInvoice $supply_invoice
 *
 * @package App\Models
 */
class SupplyInvoiceDetail extends Model
{
	protected $table = 'supply_invoice_details';
	protected $primaryKey = 'SupplyInvoiceDetailId';
	public $timestamps = false;

	protected $casts = [
		'SupplyInvoiceId' => 'int',
		'ProductID' => 'int',
		'Quantity' => 'int',
		'SupplyPrice' => 'float',
		'FinalPrice' => 'float'
	];

	protected $fillable = [
		'SupplyInvoiceId',
		'ProductID',
		'ProductName',
		'Quantity',
		'productUnit',
		'SupplyPrice',
		'discount',
		'FinalPrice'
	];

	public function supply_invoice()
	{
		return $this->belongsTo(SupplyInvoice::class, 'SupplyInvoiceId');
	}
}
