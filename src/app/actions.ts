"use server";

import { z } from "zod";

const pledgeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  whatsapp: z.string().min(10, { message: "Please enter a valid WhatsApp number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

// Placeholder for backend API
const sendReminderAPI = async (data: z.infer<typeof pledgeSchema>) => {
  console.log("Sending reminder data to backend:", data);
  // In a real app, this would make an API call:
  // await fetch('https://api.example.com/send-reminder', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  return { success: true };
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
    await sendReminderAPI(validatedFields.data);
    return { message: "Pledge successful!", success: true };
  } catch (error) {
    return { message: "Failed to pledge gift. Please try again.", success: false };
  }
}
