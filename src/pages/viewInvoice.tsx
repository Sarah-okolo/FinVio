import DeleteModal from "@/components/deleteModal";
import InvoiceForm from "@/components/invoiceForm";
import { Button } from "@/components/ui/button";
import { statusColorFn } from "@/utils";
import { ArrowLeft, Check, Dot } from "lucide-react";
import { toast } from "sonner";

const invoiceDetails = {
  id: "1",
  ref: "INV-1001",
  status: "Pending",
  issueDate: "2024-06-01",
  dueDate: "2024-06-15",
  billFrom: {
    name: "Finvio LLC",
    email: "billing@finvio.com",
    address: "123 Market Street, San Francisco, CA",
  },
  billTo: {
    name: "Alice Johnson",
    email: "alice@example.com",
    address: "789 Park Avenue, New York, NY",
  },
  project: "Brand refresh",
  currency: "$",
  items: [
    { description: "Design consultation", quantity: 10, price: 120 },
    { description: "UI mockups", quantity: 5, price: 200 },
    { description: "Asset package", quantity: 1, price: 350 },
  ],
  notes: "Thank you for your business!",
};

export default function ViewInvoice() {
  const normalizedStatus = invoiceDetails.status.toLowerCase() as string;
  const statusColor = statusColorFn(normalizedStatus);
  const totalAmount = invoiceDetails.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const fromAddressLines = invoiceDetails.billFrom.address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatCurrency = (value: number) =>
    `${invoiceDetails.currency} ${value.toFixed(2)}`;

  return (
    <div>
      <button
        className="font-bold mb-5 flex items-center gap-1 cursor-pointer"
        onClick={() => history.back()}
      >
        <ArrowLeft /> Go Back
      </button>

      <div className="p-5 rounded-xl bg-card shadow shadow-muted/10 flex justify-between items-center gap-5 mb-5">
        <div className="flex justify-between w-full md:justify-start md:w-max gap-4 items-center">
          <p className="text-muted-foreground font-semibold md:text-sm">
            Status
          </p>
          <p
            className={`${statusColor} rounded-lg w-24 py-1 pr-2 flex items-center justify-center font-bold`}
          >
            <Dot className="scale-150" /> {invoiceDetails?.status}
          </p>
        </div>

        <div className="hidden md:block">
          <ActionButtons
            id={invoiceDetails?.id}
            ref={invoiceDetails?.ref}
            status={invoiceDetails?.status}
          />
        </div>
      </div>

      <div className="p-6 md:p-10 rounded-xl bg-card shadow shadow-muted/10 flex justify-between items-center gap-5 mb-5">
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="text-sm md:text-lg font-bold">
                #{invoiceDetails.ref}
              </p>
              <p className="text-muted-foreground font-semibold text-sm">
                {invoiceDetails.project}
              </p>
            </div>

            <div className="text-muted-foreground font-semibold leading-relaxed text-sm md:text-right">
              {fromAddressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p>{invoiceDetails.billFrom.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:items-start">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-muted-foreground font-semibold text-sm">
                  Invoice Date
                </p>
                <p className="text-lg font-bold">
                  {formatDate(invoiceDetails.issueDate)}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground font-semibold text-sm">
                  Payment Due
                </p>
                <p className="text-lg font-bold">
                  {formatDate(invoiceDetails.dueDate)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground font-semibold text-sm">
                Bill To
              </p>
              <p className="text-lg font-bold">{invoiceDetails.billTo.name}</p>
              <p className="text-muted-foreground font-semibold leading-relaxed text-sm">
                {invoiceDetails.billTo.address}
              </p>
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <p className="text-muted-foreground font-semibold text-sm">
                Sent to
              </p>
              <p className="text-lg font-bold">{invoiceDetails.billTo.email}</p>
            </div>
          </div>

          <div className="bg-secondary/40 rounded-xl p-5 md:p-8 space-y-5">
            <div className="space-y-4 md:hidden">
              {invoiceDetails.items.map((item) => {
                const lineTotal = item.quantity * item.price;
                return (
                  <div
                    key={item.description}
                    className="flex items-start justify-between gap-4 font-semibold"
                  >
                    <div className="space-y-1">
                      <p className="font-bold">{item.description}</p>
                      <p className="text-muted-foreground text-sm">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-bold">{formatCurrency(lineTotal)}</p>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block">
              <div className="grid grid-cols-[2fr_repeat(3,1fr)] text-muted-foreground text-sm font-semibold px-2 pb-4">
                <p>Item Name</p>
                <p className="text-center">QTY.</p>
                <p className="text-right pr-4">Price</p>
                <p className="text-right">Total</p>
              </div>

              <div className="space-y-6">
                {invoiceDetails.items.map((item) => {
                  const lineTotal = item.quantity * item.price;
                  return (
                    <div
                      key={item.description}
                      className="grid grid-cols-[2fr_repeat(3,1fr)] items-center font-semibold px-2"
                    >
                      <p className="font-bold">{item.description}</p>
                      <p className="text-center text-muted-foreground">
                        {item.quantity}
                      </p>
                      <p className="text-right text-muted-foreground pr-4">
                        {formatCurrency(item.price)}
                      </p>
                      <p className="text-right font-bold">
                        {formatCurrency(lineTotal)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-sidebar/90 text-white rounded-b-xl mt-10 px-6 py-5 flex justify-between items-center">
              <p className="font-medium">Grand Total</p>
              <p className="text-xl font-extrabold">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="p-5 md:hidden rounded-xl bg-card shadow shadow-muted/10 flex
        justify-center items-center gap-5 mt-5 mb-5"
      >
        <ActionButtons
          id={invoiceDetails?.id}
          ref={invoiceDetails?.ref}
          status={invoiceDetails?.status}
        />
      </div>
    </div>
  );
}

function ActionButtons({
  id,
  ref,
  status,
}: {
  id: string;
  ref: string;
  status: string;
}) {
  return (
    <div className="flex gap-3">
      {status.toLowerCase() !== "paid" && (
        <InvoiceForm ref={ref}>
          <div className="rounded-full bg-muted-foreground/20 cursor-pointer hover:bg-muted-foreground/5 text-foreground px-4 py-2">
            Edit
          </div>
        </InvoiceForm>
      )}

      <DeleteModal ref={ref} id={id} />

      {status.toLowerCase() !== "paid" && (
      <Button
        className="rounded-full text-white cursor-pointer px-4 py-2"
        onClick={() => toast.success("Successfully marked as paid")}
      >
        <Check className="inline" />
        Mark as Paid
      </Button>
      )}
    </div>
  );
}
