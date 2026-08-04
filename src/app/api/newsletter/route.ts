import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email;
    const marketingConsent = body.marketingConsent ?? false;

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("email", email)
      .single();

    if (existingSubscriber) {
      return NextResponse.json(
        {
          error: "You are already subscribed!",
        },
        {
          status: 409,
        }
      );
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email,
          marketing_consent: marketingConsent,
        },
      ]);

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error: "Could not save subscription",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "You're In!",
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}