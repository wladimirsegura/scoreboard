import { supabase } from "@/app/utils/supabase";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
	try {
		const { id } = params;
		const { name, number, position } = await request.json();

		const { data, error } = await supabase
			.from("players")
			.update({
				name,
				number,
				position,
			})
			.eq("id", id)
			.select();

		if (error) {
			return NextResponse.json(
				{ error: "Failed to update player" },
				{ status: 500 }
			);
		}

		return NextResponse.json(data[0]);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
