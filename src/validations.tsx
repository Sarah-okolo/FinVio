import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z.email("A valid Email is required"),
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /\d/.test(val), {
        message: "Password must contain at least one number",
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const invoiceSchema = z.object({
  billFrom: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    postCode: z.string().min(1, "Post code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  billTo: z.object({
    name: z.string().min(1, "Client's name is required"),
    email: z.string().email("A valid email is required"),
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    postCode: z.string().min(1, "Post code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  paymentTerms: z.enum([
    "Net 30 Days",
    "Net 14 Days",
    "Net 7 Days",
    "Due on Receipt",
  ]),
  projectDescription: z.string().min(1, "Project description is required"),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        quantity: z.coerce
          .number()
          .refine((val) => !Number.isNaN(val), "Quantity is required")
          .int("Quantity must be a whole number")
          .positive("Quantity must be greater than 0"),
        price: z.coerce
          .number()
          .refine((val) => !Number.isNaN(val), "Price is required")
          .positive("Price must be greater than 0"),
      })
    )
    .min(1, "At least one item is required"),
});
