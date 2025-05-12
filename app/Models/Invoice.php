<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Invoice
 * 
 * @property int $InvoiceID
 * @property int|null $CustomerID
 * @property string $customerName
 * @property string $customerContact
 * @property Carbon $InvoiceDate
 * @property string|null $type
 * @property string $payment_option
 * @property int|null $CashierID
 * @property string|null $CashierName
 * 
 * @property Collection|CancelledTransaction[] $cancelled_transactions
 * @property Collection|DeliveryOrderStatus[] $delivery_order_statuses
 * @property Collection|Invoicedetail[] $invoicedetails
 * @property Collection|Payment[] $payments
 * @property Collection|PickupOrderStatus[] $pickup_order_statuses
 *
 * @package App\Models
 */
class Invoice extends Model
{
	protected $table = 'invoices';
	protected $primaryKey = 'InvoiceID';
	public $timestamps = false;

	protected $casts = [
		'CustomerID' => 'int',
		'InvoiceDate' => 'datetime',
		'CashierID' => 'int'
	];

	protected $fillable = [
		'CustomerID',
		'customerName',
		'customerContact',
		'InvoiceDate',
		'type',
		'payment_option',
		'CashierID',
		'CashierName'
	];

	public function cancelled_transactions()
	{
		return $this->hasMany(CancelledTransaction::class, 'InvoiceId');
	}

	public function delivery_order_statuses()
	{
		return $this->hasMany(DeliveryOrderStatus::class);
	}

	public function invoicedetails()
	{
		return $this->hasMany(Invoicedetail::class, 'InvoiceID');
	}

	public function payments()
	{
		return $this->hasMany(Payment::class, 'InvoiceID');
	}

	public function pickup_order_statuses()
	{
		return $this->hasMany(PickupOrderStatus::class);
	}
}
