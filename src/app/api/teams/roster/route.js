import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
	const cookieStore = cookies();
const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return cookieStore.get(name)?.value;
				},
			},
		}
	);
	const { searchParams } = new URL(request.url);
	const teamId = searchParams.get("teamId");

	try {
		const { data, error } = await supabase
			.from("players")
			.select("*")
			.eq("team_id", teamId)
			.order("number");

		if (error) throw error;
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(request) {
	const cookieStore = cookies();
const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name) {
					return cookieStore.get(name)?.value;
				},
			},
		}
	);
	const { teamId, player } = await request.json();

	try {
		const { data, error } = await supabase
			.from("players")
			.insert([
				{
					team_id: teamId,
					name: player.name,
					number: player.number,
					position: player.position,
				},
			])
			.select()
			.single();

		if (error) throw error;
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function PUT(request) {
	const cookieStore = cookies();
const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name) {
					return cookieStore.get(name)?.value;
				},
			},
		}
	);
	const { playerId, updates } = await request.json();

	try {
		const { data, error } = await supabase
			.from("players")
			.update(updates)
			.eq("id", playerId)
			.select()
			.single();

		if (error) throw error;
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function DELETE(request) {
	const cookieStore = cookies();
const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name) {
					return cookieStore.get(name)?.value;
				},
			},
		}
	);
	const { searchParams } = new URL(request.url);
	const playerId = searchParams.get("playerId");

	try {
		const { error } = await supabase
			.from("players")
			.delete()
			.eq("id", playerId);

		if (error) throw error;
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
