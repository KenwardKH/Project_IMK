<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class OrderStatusLog
 * 
 * @property int $id
 * @property int $invoice_id
 * @property string $order_type
 * @property string|null $previous_status
 * @property string $new_status
 * @property int|null $cashier_id
 * @property string|null $cashier_name
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class OrderStatusLog extends Model
{
	protected $table = 'order_status_logs';
	public $timestamps = false;

	protected $casts = [
		'invoice_id' => 'int',
		'cashier_id' => 'int'
	];

	protected $fillable = [
		'invoice_id',
		'order_type',
		'previous_status',
		'new_status',
		'cashier_id',
		'cashier_name'
	];
}
