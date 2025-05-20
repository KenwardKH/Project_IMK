import {
    AlertTriangle,
    ChevronDown,
    HelpCircle,
    Search,
    ShoppingCart,
    User,
  } from "lucide-react";
  import React from "react";

  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent } from "@/components/ui/card";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Input } from "@/components/ui/input";
import CartNavigationSection from "@/components/section/orders/CartNavigation";
import OrderSummarySection from "@/components/section/orders/OrderSummary";
import NavbarSection from "@/components/section/NavbarSection";

  export default function DaftarPesananBelum() {
    return (
      <div className="bg-[#f6f6f6] flex flex-row justify-center w-full min-h-screen">
        <div className="bg-[#f6f6f6] w-full max-w-[1440px] relative flex flex-col">
          {/* Header Section */}
         <NavbarSection />
         <CartNavigationSection />

          {/* Main Content */}
          <main className="flex flex-col w-full mt-8">
            <OrderSummarySection />
            <OrderSummarySection />
            {/* <OrderDetailsSection /> */}
          </main>
        </div>
      </div>
    );
  }
