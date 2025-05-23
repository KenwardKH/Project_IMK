<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PickupOrderStatus
 * 
 * @property int $id
 * @property int $invoice_id
 * @property string $status
 * @property Carbon|null $updated_at
 * @property Carbon|null $created_at
 * @property int|null $updated_by
 * 
 * @property Invoice $invoice
 *
 * @package App\Models
 */
class PickupOrderStatus extends Model
{
	protected $table = 'pickup_order_status';

	protected $casts = [
		'invoice_id' => 'int',
		'updated_by' => 'int'
	];

	protected $fillable = [
		'invoice_id',
		'status',
		'updated_by'
	];

	public function invoice()
	{
		// Explicitly specify the foreign key and owner key
		return $this->belongsTo(Invoice::class, 'invoice_id', 'InvoiceID');
	}
}