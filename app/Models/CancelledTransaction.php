<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CancelledTransaction
 * 
 * @property int $id
 * @property int|null $InvoiceId
 * @property string|null $cancellation_reason
 * @property string $cancelled_by
 * @property Carbon|null $cancellation_date
 * 
 * @property Invoice|null $invoice
 *
 * @package App\Models
 */
class CancelledTransaction extends Model
{
	protected $table = 'cancelled_transaction';
	public $timestamps = false;

	protected $casts = [
		'InvoiceId' => 'int',
		'cancellation_date' => 'datetime'
	];

	protected $fillable = [
		'InvoiceId',
		'cancellation_reason',
		'cancelled_by',
		'cancellation_date'
	];

	public function invoice()
	{
		return $this->belongsTo(Invoice::class, 'InvoiceId');
	}
}
