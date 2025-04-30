import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common Supabase operations
export const fetchTeams = async () => {
	const { data, error } = await supabase.from("teams").select("*");

	if (error) {
		console.error("Error fetching teams:", error);
		return [];
	}

	return data || [];
};

export const fetchPlayers = async (teamId) => {
	const { data, error } = await supabase
		.from("players")
		.select("*")
		.eq("team_id", teamId);

	if (error) {
		console.error("Error fetching players:", error);
		return [];
	}

	return data || [];
};

export const saveGame = async (gameData) => {
	const { data, error } = await supabase
		.from("games")
		.insert(gameData)
		.select()
		.single();

	if (error) {
		console.error("Error saving game:", error);
		return null;
	}

	return data;
};

export const updateGameScore = async (gameId, homeScore, awayScore) => {
	const { error } = await supabase
		.from("games")
		.update({
			home_score: homeScore,
			away_score: awayScore,
		})
		.eq("id", gameId);

	if (error) {
		console.error("Error updating game score:", error);
		return false;
	}

	return true;
};
