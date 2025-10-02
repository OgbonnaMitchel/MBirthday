"use server";

import { z } from "zod";
import { Resend } from 'resend';

const pledgeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  whatsapp: z.string().min(10, { message: "Please enter a valid WhatsApp number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const resend = new Resend(process.env.RESEND_API_KEY);

const sendReminderAPI = async (data: z.infer<typeof pledgeSchema>) => {
  console.log("Sending reminder data to backend:", data);

  try {
    await resend.emails.send({
      from: 'ogbonnamitchel004@gmail.com',
      to: data.email,
      subject: 'Thank you for your gift pledge!',
      text: `Hi ${data.name},\n\nThank you for pledging a gift for the birthday celebration. We'll send you a reminder closer to the date.\n\nBest,\nThe Birthday Team`,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    // Even if email fails, we can consider the pledge successful on the frontend
    // and handle the email failure separately (e.g., logging, retry mechanism).
    // For this example, we'll return success but you might want more robust error handling.
    return { success: true, error: "Failed to send confirmation email." };
  }
};

export async function pledgeGift(
  prevState: any,
  formData: FormData
): Promise<{ message: string; errors?: any; success: boolean }> {
  const validatedFields = pledgeSchema.safeParse({
    name: formData.get("name"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed.",
      success: false,
    };
  }

  try {
    const result = await sendReminderAPI(validatedFields.data);
    if (result.success) {
      return { message: "Pledge successful!", success: true };
    }
    // This part might not be reached if sendReminderAPI always returns success.
    return { message: result.error || "Failed to pledge gift. Please try again.", success: false };
  } catch (error) {
    return { message: "Failed to pledge gift. Please try again.", success: false };
  }
}
