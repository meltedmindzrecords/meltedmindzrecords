import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Created per request (not at import) so a missing env var can't break the build.
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
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

    // The public key can only insert (no select policy), so we can't look up
    // existing rows first. Insert, and treat the UNIQUE(email) violation as
    // "already subscribed" so the visitor still sees success.
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email,
          marketing_consent: marketingConsent,
        },
      ]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: true,
            message: "You're already on the list!",
          },
          {
            status: 200,
          }
        );
      }

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
