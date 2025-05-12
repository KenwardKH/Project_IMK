<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Payment
 * 
 * @property int $PaymentID
 * @property int|null $InvoiceID
 * @property Carbon $PaymentDate
 * @property float $AmountPaid
 * @property string|null $PaymentImage
 * 
 * @property Invoice|null $invoice
 *
 * @package App\Models
 */
class Payment extends Model
{
	protected $table = 'payments';
	protected $primaryKey = 'PaymentID';
	public $timestamps = false;

	protected $casts = [
		'InvoiceID' => 'int',
		'PaymentDate' => 'datetime',
		'AmountPaid' => 'float'
	];

	protected $fillable = [
		'InvoiceID',
		'PaymentDate',
		'AmountPaid',
		'PaymentImage'
	];

	public function invoice()
	{
		return $this->belongsTo(Invoice::class, 'InvoiceID');
	}
}
