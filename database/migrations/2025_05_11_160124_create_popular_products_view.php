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
        DB::statement("CREATE VIEW `popular_products` AS with `monthlysales` as (select date_format(`ivc`.`InvoiceDate`,'%Y-%m') AS `month`,`prd`.`ProductID` AS `ProductID`,`prd`.`ProductName` AS `productName`,sum(`ivd`.`Quantity`) AS `sold` from ((((`imk_db`.`invoicedetails` `ivd` join `imk_db`.`invoices` `ivc` on((`ivc`.`InvoiceID` = `ivd`.`InvoiceID`))) join `imk_db`.`products` `prd` on((`prd`.`ProductID` = `ivd`.`ProductID`))) left join `imk_db`.`delivery_order_status` `dos` on((`dos`.`invoice_id` = `ivd`.`InvoiceID`))) left join `imk_db`.`pickup_order_status` `pos` on((`pos`.`invoice_id` = `ivd`.`InvoiceID`))) where ((`dos`.`status` = 'selesai') or (`pos`.`status` = 'selesai')) group by `month`,`prd`.`ProductID`) select `ms`.`month` AS `month`,`ms`.`ProductID` AS `ProductID`,`ms`.`productName` AS `productName`,`ms`.`sold` AS `sold` from (`monthlysales` `ms` join (select `monthlysales`.`month` AS `month`,max(`monthlysales`.`sold`) AS `max_sold` from `monthlysales` group by `monthlysales`.`month`) `top_products` on(((`ms`.`month` = `top_products`.`month`) and (`ms`.`sold` = `top_products`.`max_sold`))))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS `popular_products`");
    }
};
