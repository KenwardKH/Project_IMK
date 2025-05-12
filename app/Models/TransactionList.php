<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TransactionList
 * 
 * @property int $TransactionID
 * @property int|null $InvoiceID
 * @property string|null $CustomerName
 * @property string|null $CustomerContact
 * @property Carbon|null $InvoiceDate
 * @property string|null $PaymentOption
 * @property string|null $CashierName
 * @property float|null $TotalAmount
 * @property Carbon|null $PaymentDate
 * @property float|null $AmountPaid
 * @property string|null $OrderStatus
 *
 * @package App\Models
 */
class TransactionList extends Model
{
	protected $table = 'transaction_list';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'TransactionID' => 'int',
		'InvoiceID' => 'int',
		'InvoiceDate' => 'datetime',
		'TotalAmount' => 'float',
		'PaymentDate' => 'datetime',
		'AmountPaid' => 'float'
	];

	protected $fillable = [
		'TransactionID',
		'InvoiceID',
		'CustomerName',
		'CustomerContact',
		'InvoiceDate',
		'PaymentOption',
		'CashierName',
		'TotalAmount',
		'PaymentDate',
		'AmountPaid',
		'OrderStatus'
	];
}
