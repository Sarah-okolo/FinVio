import { statusColorFn } from "@/utils";
import { ChevronRight, Dot } from "lucide-react";
import { Link } from "react-router-dom";

type Invoice = {
  id: string;
  ref: string;
  due_date: string;
  status: string;
  recipient_name: string;
  amount?: number;
  currency?: string;
};

export default function PreviewCard({ invoice }: { invoice: Invoice }) {
  const normalizedStatus = invoice.status.toLowerCase() as string;
  const statusColor = statusColorFn(normalizedStatus);
  const statusLabel =
    normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

  const formattedDate = (() => {
    const parsed = new Date(invoice.due_date);
    return Number.isNaN(parsed.getTime())
      ? invoice.due_date
      : parsed.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  })();

  const formattedAmount =
    typeof invoice.amount === "number"
      ? `${invoice.currency ?? "$"}${invoice.amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "-";

  return (
    <Link to={`/invoice/${invoice?.id}`}>
      <div className="bg-card rounded-xl p-7 shadow-xl shadow-muted/10 cursor-pointer hover:scale-105 transition-transform mb-4">
        <div className="flex flex-col gap-6 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold text-lg">
              <span className="text-muted-foreground min-w-max">#</span>
              {invoice.ref}
            </p>
            <p className="text-right font-semibold">{invoice.recipient_name}</p>
          </div>

          <p className="text-muted-foreground font-medium text-lg">
            Due {formattedDate}
          </p>

          <div className="flex items-center justify-between gap-4">
            <p className="font-bold text-xl">{formattedAmount}</p>
            <p
              className={`${statusColor} rounded-2xl px-4 py-2 flex items-center justify-center gap-2 font-bold md:text-lg`}
            >
              <Dot className="scale-125" /> {statusLabel}
            </p>
          </div>
        </div>

        <div className="hidden md:flex gap-5 justify-between items-center">
          <p className="font-bold">
            <span className="text-muted-foreground min-w-max">#</span>
            {invoice.ref}
          </p>
          <p className="text-muted-foreground font-medium min-w-max">
            Due on {formattedDate}
          </p>
          <p className="truncate line-clamp-1">{invoice.recipient_name}</p>
          <p className="font-bold min-w-max">{formattedAmount}</p>
          <p
            className={`${statusColor} rounded-lg w-24 py-1 pr-2 flex items-center justify-center font-bold`}
          >
            <Dot className="scale-150" /> {statusLabel}
          </p>

          <ChevronRight className="text-primary" />
        </div>
      </div>
    </Link>
  );
}
