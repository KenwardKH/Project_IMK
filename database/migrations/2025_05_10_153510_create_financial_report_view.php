<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("CREATE VIEW `financial_report` AS with `revenuedata` as (select date_format(`i`.`InvoiceDate`,'%Y-%m') AS `ReportMonth`,count(distinct `i`.`InvoiceID`) AS `TotalTransactions`,sum((`id`.`price` * `id`.`Quantity`)) AS `TotalRevenue` from (((`imk_db`.`invoices` `i` join `imk_db`.`invoicedetails` `id` on((`i`.`InvoiceID` = `id`.`InvoiceID`))) left join `imk_db`.`delivery_order_status` `dos` on((`dos`.`invoice_id` = `i`.`InvoiceID`))) left join `imk_db`.`pickup_order_status` `pos` on((`pos`.`invoice_id` = `i`.`InvoiceID`))) where ((`dos`.`status` = 'selesai') or (`pos`.`status` = 'selesai')) group by date_format(`i`.`InvoiceDate`,'%Y-%m')), `spendingdata` as (select date_format(`si`.`SupplyDate`,'%Y-%m') AS `ReportMonth`,sum((`sid`.`SupplyPrice` * `sid`.`Quantity`)) AS `TotalSpending` from (`imk_db`.`supply_invoices` `si` join `imk_db`.`supply_invoice_details` `sid` on((`si`.`SupplyInvoiceId` = `sid`.`SupplyInvoiceId`))) group by date_format(`si`.`SupplyDate`,'%Y-%m')) select `r`.`ReportMonth` AS `ReportMonth`,`r`.`TotalTransactions` AS `TotalTransactions`,`r`.`TotalRevenue` AS `TotalRevenue`,ifnull(`s`.`TotalSpending`,0) AS `TotalSpending`,(`r`.`TotalRevenue` - ifnull(`s`.`TotalSpending`,0)) AS `ProfitLoss` from (`revenuedata` `r` left join `spendingdata` `s` on((`r`.`ReportMonth` = `s`.`ReportMonth`))) order by `r`.`ReportMonth`");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS `financial_report`");
    }
};
