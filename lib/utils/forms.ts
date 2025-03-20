import { supabase } from "@/lib/supabaseClient"

interface ContactFormData {
  name: string
  email: string
  subject: string
  description: string
}

export async function submitBugReport(description: string) {
  try {
    console.log("Submitting bug report:", description)

    if (!supabase) {
      throw new Error("Supabase client not initialized")
    }

    const { data, error } = await supabase.from("bugs-report").insert([{ description }])

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    console.log("Bug report submitted successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Error submitting bug report:", error)
    return { success: false, error }
  }
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    console.log("Submitting contact form:", formData)

    if (!supabase) {
      throw new Error("Supabase client not initialized")
    }

    const { data, error } = await supabase.from("contact-form").insert([formData])

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    console.log("Contact form submitted successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return { success: false, error }
  }
}

