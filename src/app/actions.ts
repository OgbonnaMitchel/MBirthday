"use server";

import { z } from "zod";
import { Resend } from 'resend';

const pledgeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  whatsapp: z.string().min(10, { message: "Please enter a valid WhatsApp number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  giftTitle: z.string(),
});

const sendReminderAPI = async (data: z.infer<typeof pledgeSchema>) => {
  console.log("Sending reminder data to backend:", data);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    // Email to the person pledging
    await resend.emails.send({
      from: 'ogbonnamitchel004@gmail.com',
      to: data.email,
      subject: 'Your gift pledge has been received!',
      text: `Hi ${data.name},\n\nThank you for your generous pledge for the ${data.giftTitle}. Your pledge has been received, and the celebrant, Ogbonna Mitchel, will be expecting your gift.\n\nWe'll send you a reminder closer to the birthday.\n\nBest regards,\nThe Birthday Team`,
    });

    // Notification email to the birthday person
    await resend.emails.send({
        from: 'ogbonnamitchel004@gmail.com',
        to: 'ogbonnamitchel004@gmail.com',
        subject: `New Gift Pledge: ${data.giftTitle}`,
        text: `Great news!
        \nSomeone just pledged a gift for your birthday.
        \nGift: ${data.giftTitle}
        \nPledger's Name: ${data.name}
        \nPledger's Email: ${data.email}
        \nLet the celebration begin!
        \n\nBest,
        \nYour Birthday Wishlist App`,
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
    giftTitle: formData.get("giftTitle"),
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
