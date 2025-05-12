<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class FinancialReport
 * 
 * @property string|null $ReportMonth
 * @property int $TotalTransactions
 * @property float|null $TotalRevenue
 * @property float $TotalSpending
 * @property float|null $ProfitLoss
 *
 * @package App\Models
 */
class FinancialReport extends Model
{
	protected $table = 'financial_report';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'TotalTransactions' => 'int',
		'TotalRevenue' => 'float',
		'TotalSpending' => 'float',
		'ProfitLoss' => 'float'
	];

	protected $fillable = [
		'ReportMonth',
		'TotalTransactions',
		'TotalRevenue',
		'TotalSpending',
		'ProfitLoss'
	];
}
