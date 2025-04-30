import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request, { params }) {
	try {
		const { teamId } = params;
		const cookieStore = cookies();

		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
			{
				cookies: {
					get(name) {
						return cookieStore.get(name)?.value;
					},
					set(name, value, options) {
						try {
							cookieStore.set({ name, value, ...options });
						} catch (error) {
							// Handle cookie setting error
						}
					},
					remove(name, options) {
						try {
							cookieStore.set({ name, value: "", ...options });
						} catch (error) {
							// Handle cookie removal error
						}
					},
				},
			}
		);

		const { data: players, error } = await supabase
			.from("players")
			.select(
				`
        id,
        name,
        number,
        position,
        is_active,
        player_stats (
          goals,
          assists,
          points
        )
      `
			)
			.eq("team_id", teamId)
			.eq("is_active", true);

		if (error) {
			console.error("Database error:", error);
			return NextResponse.json(
				{ error: "Failed to fetch team roster" },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			data: players || [],
		});
	} catch (error) {
		console.error("Server error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
