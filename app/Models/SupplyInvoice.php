<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SupplyInvoice
 * 
 * @property int $SupplyInvoiceId
 * @property string|null $SupplyInvoiceNumber
 * @property int $SupplierId
 * @property string $SupplierName
 * @property Carbon $SupplyDate
 * @property string|null $SupplyInvoiceImage
 * 
 * @property Collection|SupplyInvoiceDetail[] $supply_invoice_details
 *
 * @package App\Models
 */
class SupplyInvoice extends Model
{
	protected $table = 'supply_invoices';
	protected $primaryKey = 'SupplyInvoiceId';
	public $timestamps = false;

	protected $casts = [
		'SupplierId' => 'int',
		'SupplyDate' => 'datetime'
	];

	protected $fillable = [
		'SupplyInvoiceNumber',
		'SupplierId',
		'SupplierName',
		'SupplyDate',
		'SupplyInvoiceImage'
	];

	public function supply_invoice_details()
	{
		return $this->hasMany(SupplyInvoiceDetail::class, 'SupplyInvoiceId');
	}
}
