import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  useForm,
  useFieldArray,
  type Resolver,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema } from "@/validations";
import type { z } from "zod";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function InvoiceForm({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref?: string;
}) {
  type InvoiceFormValues = z.infer<typeof invoiceSchema>;
  const isEdit = Boolean(ref);

  const defaultValues: InvoiceFormValues = {
    billFrom: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    billTo: {
      name: "",
      email: "",
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    invoiceDate: "",
    paymentTerms: "Net 30 Days",
    projectDescription: "",
    items: [{ name: "", quantity: 1, price: 0 }],
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema) as Resolver<InvoiceFormValues>,
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items") || [];
  const grandTotal = items.reduce((sum, item) => {
    const qty = Number(item?.quantity) || 0;
    const price = Number(item?.price) || 0;
    return sum + qty * price;
  }, 0);

  const labelClass =
    "text-[11px] font-semibold uppercase tracking-[0.14em] text-primary";
  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary placeholder:text-muted-foreground/70 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/30";
  const errorClass = "text-destructive text-xs font-medium";

  const formatDateDisplay = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleFormSubmit = (
    data: InvoiceFormValues,
    action: "draft" | "send" | "save" = "save"
  ) => {
    const payload = {
      ...data,
      total: Number(grandTotal.toFixed(2)),
      action,
      mode: isEdit ? "edit" : "create",
      ref,
    };

    console.log("Invoice submission:", payload);
    toast.success(
      isEdit
        ? "Invoice updated successfully"
        : action === "draft"
          ? "Draft saved"
          : "Invoice ready"
    );

    if (!isEdit) {
      reset(defaultValues);
    }
  };

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="min-w-full sm:min-w-1/2 lg:min-w-[40%] 2xl:min-w-[32%]">
        <form
          className="flex flex-col h-full"
          onSubmit={handleSubmit((data) => handleFormSubmit(data, "save"))}
          noValidate
        >
          <SheetHeader>
            <SheetTitle className="mt-5 font-bold text-xl">
              {!ref ? "New Invoice" : `Edit #${ref}`}
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <div className="px-6 overflow-y-auto pb-52 pt-2 space-y-8">
            <div className="space-y-3">
              <p className={labelClass}>Bill From</p>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Street Address</label>
                <input
                  className={inputClass}
                  placeholder="19 Union Terrace"
                  {...register("billFrom.street")}
                  aria-invalid={!!errors.billFrom?.street}
                />
                {errors.billFrom?.street && (
                  <p className={errorClass}>{errors.billFrom.street.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">City</label>
                  <input
                    className={inputClass}
                    placeholder="London"
                    {...register("billFrom.city")}
                    aria-invalid={!!errors.billFrom?.city}
                  />
                  {errors.billFrom?.city && (
                    <p className={errorClass}>
                      {errors.billFrom.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Post Code</label>
                  <input
                    className={inputClass}
                    placeholder="E1 3EZ"
                    {...register("billFrom.postCode")}
                    aria-invalid={!!errors.billFrom?.postCode}
                  />
                  {errors.billFrom?.postCode && (
                    <p className={errorClass}>
                      {errors.billFrom.postCode.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Country</label>
                  <input
                    className={inputClass}
                    placeholder="United Kingdom"
                    {...register("billFrom.country")}
                    aria-invalid={!!errors.billFrom?.country}
                  />
                  {errors.billFrom?.country && (
                    <p className={errorClass}>
                      {errors.billFrom.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className={labelClass}>Bill To</p>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Client&apos;s Name</label>
                <input
                  className={inputClass}
                  placeholder="Alex Grim"
                  {...register("billTo.name")}
                  aria-invalid={!!errors.billTo?.name}
                />
                {errors.billTo?.name && (
                  <p className={errorClass}>{errors.billTo.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Client&apos;s Email</label>
                <input
                  className={inputClass}
                  type="email"
                  placeholder="alexgrim@mail.com"
                  {...register("billTo.email")}
                  aria-invalid={!!errors.billTo?.email}
                />
                {errors.billTo?.email && (
                  <p className={errorClass}>{errors.billTo.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Street Address</label>
                <input
                  className={inputClass}
                  placeholder="84 Church Way"
                  {...register("billTo.street")}
                  aria-invalid={!!errors.billTo?.street}
                />
                {errors.billTo?.street && (
                  <p className={errorClass}>{errors.billTo.street.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">City</label>
                  <input
                    className={inputClass}
                    placeholder="Bradford"
                    {...register("billTo.city")}
                    aria-invalid={!!errors.billTo?.city}
                  />
                  {errors.billTo?.city && (
                    <p className={errorClass}>{errors.billTo.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Post Code</label>
                  <input
                    className={inputClass}
                    placeholder="BD1 9PB"
                    {...register("billTo.postCode")}
                    aria-invalid={!!errors.billTo?.postCode}
                  />
                  {errors.billTo?.postCode && (
                    <p className={errorClass}>
                      {errors.billTo.postCode.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Country</label>
                  <input
                    className={inputClass}
                    placeholder="United Kingdom"
                    {...register("billTo.country")}
                    aria-invalid={!!errors.billTo?.country}
                  />
                  {errors.billTo?.country && (
                    <p className={errorClass}>
                      {errors.billTo.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr] gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Invoice Date</label>
                <Controller
                  control={control}
                  name="invoiceDate"
                  render={({ field }) => {
                    const displayDate = field.value
                      ? formatDateDisplay(field.value)
                      : "";
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              inputClass,
                              "flex items-center justify-between text-left",
                              !displayDate && "text-muted-foreground"
                            )}
                            aria-invalid={!!errors.invoiceDate}
                          >
                            <span className="truncate">
                              {displayDate || "Invoice Date"}
                            </span>
                            <CalendarIcon className="size-4 text-muted-foreground" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              const iso =
                                date?.toISOString() ??
                                (field.value ? field.value : "");
                              field.onChange(iso);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
                {errors.invoiceDate && (
                  <p className={errorClass}>{errors.invoiceDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Payment Terms</label>
                <Controller
                  control={control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            inputClass,
                            "flex items-center justify-between text-left",
                            !field.value && "text-muted-foreground"
                          )}
                          aria-invalid={!!errors.paymentTerms}
                        >
                          <span className="truncate">{field.value}</span>
                          <ChevronDown className="size-4 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="p-2 w-[260px]">
                        <div className="flex flex-col divide-y rounded-md">
                          {[
                            "Net 30 Days",
                            "Net 14 Days",
                            "Net 7 Days",
                            "Due on Receipt",
                          ].map((option) => (
                            <button
                              key={option}
                              type="button"
                              className={cn(
                                "w-full text-left px-3 py-2 hover:bg-muted rounded-sm font-semibold",
                                field.value === option && "text-primary"
                              )}
                              onClick={() => field.onChange(option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.paymentTerms && (
                  <p className={errorClass}>{errors.paymentTerms.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Project Description
              </label>
              <input
                className={inputClass}
                placeholder="Graphic Design"
                {...register("projectDescription")}
                aria-invalid={!!errors.projectDescription}
              />
              {errors.projectDescription && (
                <p className={errorClass}>
                  {errors.projectDescription.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <p className={labelClass}>Item List</p>

              <div className="hidden sm:grid grid-cols-[2fr_repeat(3,1fr)] text-sm text-muted-foreground font-semibold px-2">
                <p>Item Name</p>
                <p className="text-center">Qty.</p>
                <p className="text-right pr-4">Price</p>
                <p className="text-right">Total</p>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => {
                  const lineTotal =
                    (Number(items[index]?.quantity) || 0) *
                    (Number(items[index]?.price) || 0);

                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 sm:grid-cols-[2fr_repeat(3,1fr)] gap-3 items-center bg-muted/10 rounded-lg p-3 sm:p-2"
                    >
                      <div className="space-y-1">
                        <label className="text-sm font-semibold sm:hidden">
                          Item Name
                        </label>
                        <input
                          className={inputClass}
                          placeholder="Banner Design"
                          {...register(`items.${index}.name` as const)}
                          aria-invalid={
                            !!errors.items?.[index]?.name
                          }
                        />
                        {errors.items?.[index]?.name && (
                          <p className={errorClass}>
                            {errors.items[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold sm:hidden">
                          Qty.
                        </label>
                        <input
                          type="number"
                          className={`${inputClass} sm:text-center`}
                          min={1}
                          {...register(`items.${index}.quantity` as const, {
                            valueAsNumber: true,
                          })}
                          aria-invalid={
                            !!errors.items?.[index]?.quantity
                          }
                        />
                        {errors.items?.[index]?.quantity && (
                          <p className={errorClass}>
                            {errors.items[index]?.quantity?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold sm:hidden">
                          Price
                        </label>
                        <input
                          type="number"
                          className={`${inputClass} sm:text-right`}
                          step="0.01"
                          min={0}
                          {...register(`items.${index}.price` as const, {
                            valueAsNumber: true,
                          })}
                          aria-invalid={!!errors.items?.[index]?.price}
                        />
                        {errors.items?.[index]?.price && (
                          <p className={errorClass}>
                            {errors.items[index]?.price?.message}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="space-y-1 w-full">
                          <p className="text-sm font-semibold sm:hidden">
                            Total
                          </p>
                          <p className="font-bold text-right">
                            {lineTotal.toFixed(2)}
                          </p>
                        </div>

                        <button
                          type="button"
                          aria-label="Remove item"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => remove(index)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {typeof errors.items?.message === "string" && (
                  <p className={errorClass}>{errors.items?.message}</p>
                )}

                <Button
                  type="button"
                  className="w-full rounded-full bg-muted/60 text-foreground/80 cursor-pointer py-1 font-bold hover:bg-muted/40"
                  onClick={() => append({ name: "", quantity: 1, price: 0 })}
                >
                  <Plus size={18} /> Add New Item
                </Button>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-card min-w-full sm:min-w-1/2 lg:min-w-[40%] 2xl:min-w-[32%] fixed bottom-0 shadow-2xl shadow-muted-foreground/60">
            {!ref ? (
              <div className="flex items-center gap-4 pr-5">
                <SheetClose asChild>
                  <Button
                    type="button"
                    className="font-bold text-muted-foreground bg-muted-foreground/20 hover:bg-muted-foreground/10 rounded-full cursor-pointer px-4 py-2"
                  >
                    Cancel
                  </Button>
                </SheetClose>
                <Button
                  type="button"
                  className="rounded-full text-white cursor-pointer px-4 py-2"
                  onClick={handleSubmit((data) => handleFormSubmit(data, "save"))}
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="flex w-full justify-between items-center gap-5 pr-5">
                <SheetClose asChild>
                  <Button
                    type="button"
                    className="font-bold text-muted-foreground bg-muted-foreground/20 hover:bg-muted-foreground/10 rounded-full cursor-pointer px-4 py-2"
                  >
                    Discard
                  </Button>
                </SheetClose>

                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    className="rounded-full bg-foreground text-muted-foreground cursor-pointer px-4 py-2"
                    onClick={handleSubmit((data) =>
                      handleFormSubmit(data, "draft")
                    )}
                  >
                    Save as Draft
                  </Button>

                  <Button
                    type="button"
                    className="rounded-full text-white cursor-pointer px-4 py-2"
                    onClick={handleSubmit((data) => handleFormSubmit(data, "send"))}
                  >
                    Save & Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
