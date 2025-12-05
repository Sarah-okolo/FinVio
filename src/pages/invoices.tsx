import { ChevronDown, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PreviewCard from "@/components/previewCard";
import { useState } from "react";
import InvoiceForm from "@/components/invoiceForm";
import { Checkbox } from "@/components/ui/checkbox";

export default function Invoices() {
  const invoices = [
    {
      id: "1",
      ref: "INV-1001",
      due_date: "2024-06-15",
      status: "pending",
      recipient_name: "Alice Johnson",
      amount: 1250.5,
      currency: "$",
    },
    {
      id: "2",
      ref: "INV-1002",
      due_date: "2024-06-22",
      status: "paid",
      recipient_name: "Marcus Lee",
      amount: 980,
      currency: "$",
    },
    {
      id: "3",
      ref: "INV-1003",
      due_date: "2024-06-30",
      status: "due",
      recipient_name: "Priya Singh",
      amount: 2100,
      currency: "$",
    },
    {
      id: "4",
      ref: "INV-1004",
      due_date: "2024-07-05",
      status: "draft",
      recipient_name: "Hannah Park",
      amount: 450.75,
      currency: "$",
    },
    {
      id: "5",
      ref: "INV-1005",
      due_date: "2024-07-12",
      status: "pending",
      recipient_name: "Diego Ramirez",
      amount: 1645.25,
      currency: "$",
    },
  ];

  const statusOptions = Array.from(
    new Set(invoices.map((invoice) => invoice.status))
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    );
  };

  const filteredInvoices =
    selectedStatuses.length === 0
      ? invoices
      : invoices.filter((invoice) => selectedStatuses.includes(invoice.status));

  return (
    <div>
      <header className="flex items-center justify-between gap-5">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl mb-1">Invoices</h1>
          <div className="text-muted-foreground font-medium">
            {filteredInvoices.length === 0 ? (
              <p>No invoices</p>
            ) : (
              <p>There are {filteredInvoices.length} total invoices</p>
            )}
          </div>
        </div>

        <div className="flex gap-4 md:gap-6 items-center mr-4">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger className="flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
              <p className="font-bold min-w-max">
                Filter <span className="hidden md:inline-block">by status</span>
              </p>
              <ChevronDown
                className={`text-accent transition-transform duration-200 ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </PopoverTrigger>
            <PopoverContent className="max-w-max pr-14 pl-6">
              <div className="flex flex-col gap-3 py-1">
                {statusOptions.map((status) => {
                  const isSelected = selectedStatuses.includes(status);
                  const checkboxId = `status-${status}`;
                  return (
                    <div
                      key={status}
                      className="flex items-center gap-3 hover:opacity-90 transition"
                    >
                      <Checkbox
                        id={checkboxId}
                        checked={isSelected}
                        onCheckedChange={() => toggleStatus(status)}
                        className="size-5"
                      />
                      <label
                        htmlFor={checkboxId}
                        className="font-semibold capitalize cursor-pointer select-none"
                      >
                        {status}
                      </label>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          <InvoiceForm>
            <div className="bg-primary flex items-center gap-2 rounded-full py-3 px-5 font-bold text-white cursor-pointer">
              <Plus size={20} className="bg-white text-accent rounded-full" />{" "}
              New<span className="hidden md:inline-block">Invoice</span>
            </div>
          </InvoiceForm>
        </div>
      </header>

      <div className="mt-10">
        {filteredInvoices.length > 0 ? (
          <div>
            {filteredInvoices?.map((invoice) => (
              <PreviewCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        ) : (
          <div className="grid place-items-center justify-center mt-28">
            <div>
              <img
                src="/empty-state.png"
                alt="2d Illustration of a girl holden a megaphone"
                className="rounded-full w-40 mx-auto md:w-68 object-contain"
              />

              <div className="text-center mt-8">
                <p className="font-bold text-lg">There is nothing here</p>
                <p className="mt-2 font-medium text-muted">
                  Create an invoice by clicking the <br />
                  <span className="font-bold">New Invoice</span> button and get
                  started
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
