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
        DB::statement("CREATE VIEW `transaction_list` AS select `tl`.`TransactionID` AS `TransactionID`,`tl`.`InvoiceID` AS `InvoiceID`,`i`.`customerName` AS `CustomerName`,`i`.`customerContact` AS `CustomerContact`,`i`.`InvoiceDate` AS `InvoiceDate`,`i`.`payment_option` AS `PaymentOption`,`i`.`CashierName` AS `CashierName`,`tl`.`TotalAmount` AS `TotalAmount`,`p`.`PaymentDate` AS `PaymentDate`,`p`.`AmountPaid` AS `AmountPaid`,(case when (`po`.`status` is not null) then `po`.`status` when (`dos`.`status` is not null) then `dos`.`status` else 'Unknown' end) AS `OrderStatus` from ((((`imk_db`.`transaction_log` `tl` left join `imk_db`.`invoices` `i` on((`tl`.`InvoiceID` = `i`.`InvoiceID`))) left join `imk_db`.`payments` `p` on((`p`.`InvoiceID` = `i`.`InvoiceID`))) left join `imk_db`.`pickup_order_status` `po` on((`po`.`invoice_id` = `i`.`InvoiceID`))) left join `imk_db`.`delivery_order_status` `dos` on((`dos`.`invoice_id` = `i`.`InvoiceID`)))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS `transaction_list`");
    }
};
