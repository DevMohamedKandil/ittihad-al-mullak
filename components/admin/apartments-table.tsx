"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Eye,
  Receipt,
  MessageSquare,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Apartment {
  id: string;
  number: string;
  floor: number;
  owner: string;
  phone: string;
  status: "paid" | "partial" | "unpaid";
  dueAmount: number;
  type: "owner" | "tenant";
}

const apartments: Apartment[] = [
  {
    id: "1",
    number: "١٠١",
    floor: 1,
    owner: "محمد أحمد",
    phone: "٠١٠١٢٣٤٥٦٧٨",
    status: "paid",
    dueAmount: 0,
    type: "owner",
  },
  {
    id: "2",
    number: "١٠٢",
    floor: 1,
    owner: "سارة محمود",
    phone: "٠١٠٩٨٧٦٥٤٣٢",
    status: "partial",
    dueAmount: 500,
    type: "owner",
  },
  {
    id: "3",
    number: "٢٠١",
    floor: 2,
    owner: "أحمد علي",
    phone: "٠١٢٣٤٥٦٧٨٩٠",
    status: "unpaid",
    dueAmount: 1500,
    type: "tenant",
  },
  {
    id: "4",
    number: "٢٠٢",
    floor: 2,
    owner: "فاطمة حسن",
    phone: "٠١١١٢٢٢٣٣٣٤",
    status: "paid",
    dueAmount: 0,
    type: "owner",
  },
  {
    id: "5",
    number: "٣٠١",
    floor: 3,
    owner: "عمر خالد",
    phone: "٠١٥٥٥٦٦٦٧٧٧",
    status: "unpaid",
    dueAmount: 1500,
    type: "tenant",
  },
  {
    id: "6",
    number: "٣٠٢",
    floor: 3,
    owner: "نورا إبراهيم",
    phone: "٠١٠٠٠١١١٢٢٢",
    status: "partial",
    dueAmount: 750,
    type: "owner",
  },
];

const statusConfig = {
  paid: {
    label: "مدفوع",
    variant: "default" as const,
    className: "bg-success text-success-foreground hover:bg-success/90",
  },
  partial: {
    label: "جزئي",
    variant: "secondary" as const,
    className: "bg-warning text-warning-foreground hover:bg-warning/90",
  },
  unpaid: {
    label: "غير مدفوع",
    variant: "destructive" as const,
    className: "",
  },
};

export function ApartmentsTable() {
  const [search, setSearch] = useState("");

  const filteredApartments = apartments.filter(
    (apt) =>
      apt.owner.includes(search) ||
      apt.number.includes(search) ||
      apt.phone.includes(search)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">قائمة الشقق</CardTitle>
            <CardDescription>
              إدارة شقق العمارة وحالة الدفع
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الشقة</TableHead>
                <TableHead className="text-right">الطابق</TableHead>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">المستحق</TableHead>
                <TableHead className="text-right w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApartments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-medium">{apt.number}</TableCell>
                  <TableCell>{apt.floor}</TableCell>
                  <TableCell>{apt.owner}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {apt.type === "owner" ? "مالك" : "مستأجر"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusConfig[apt.status].variant}
                      className={cn(statusConfig[apt.status].className)}
                    >
                      {statusConfig[apt.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {apt.dueAmount > 0 ? `${apt.dueAmount} ج.م` : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Receipt className="h-4 w-4" />
                          إرسال فاتورة
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          إرسال رسالة
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Phone className="h-4 w-4" />
                          اتصال
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
