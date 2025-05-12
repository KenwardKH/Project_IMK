<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TransactionLog
 * 
 * @property int $TransactionID
 * @property int|null $InvoiceID
 * @property int|null $CustomerID
 * @property string $customerName
 * @property string $customerContact
 * @property float|null $TotalAmount
 * @property Carbon|null $TransactionDate
 *
 * @package App\Models
 */
class TransactionLog extends Model
{
	protected $table = 'transaction_log';
	protected $primaryKey = 'TransactionID';
	public $timestamps = false;

	protected $casts = [
		'InvoiceID' => 'int',
		'CustomerID' => 'int',
		'TotalAmount' => 'float',
		'TransactionDate' => 'datetime'
	];

	protected $fillable = [
		'InvoiceID',
		'CustomerID',
		'customerName',
		'customerContact',
		'TotalAmount',
		'TransactionDate'
	];
}
