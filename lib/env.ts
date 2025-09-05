export const env = {
  stripe: {
    pk: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    sk: process.env.STRIPE_SECRET_KEY || "",
    currency: process.env.NEXT_PUBLIC_CURRENCY || "USD",
  },
  email: {
    provider: process.env.EMAIL_PROVIDER || "",
    apiKey: process.env.EMAIL_API_KEY || "",
    sendOnCatering: process.env.SEND_CATERING_EMAIL === "true",
    sendOnContact: process.env.SEND_CONTACT_EMAIL === "true",
  },
  catering: {
    depositEnabled: process.env.CATERING_DEPOSIT_ENABLED === "true",
    depositAmountCents: Number(process.env.CATERING_DEPOSIT_CENTS || 5000),
  }
};

