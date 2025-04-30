"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

export default function TeamManagement() {
	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedTeam, setSelectedTeam] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingPlayer, setEditingPlayer] = useState(null);
	const [playerData, setPlayerData] = useState({
		name: "",
		number: "",
		position: "",
	});
	const [newPlayer, setNewPlayer] = useState({
		name: "",
		number: "",
		position: "",
	});

	const handleSubmit = async (teamId) => {
		try {
			if (editingPlayer) {
				const response = await fetch(`/api/players/${editingPlayer.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: playerData.name,
						number: playerData.number,
						position: playerData.position,
					}),
				});

				if (!response.ok) throw new Error('Failed to update player');
				toast({
					title: "Success",
					description: "Player updated successfully",
				});
			} else {
				const { error } = await supabase.from("players").insert([
					{
						team_id: teamId,
						name: playerData.name,
						number: playerData.number,
						position: playerData.position,
						is_active: true,
					},
				]);

				if (error) throw error;
				toast({
					title: "Success",
					description: "Player added successfully",
				});
			}

			setIsDialogOpen(false);
			setEditingPlayer(null);
			setPlayerData({ name: "", number: "", position: "" });
			fetchTeams();
		} catch (err) {
			toast({
				title: "Error",
				description: editingPlayer
					? "Failed to update player"
					: "Failed to add player",
				variant: "destructive",
			});
		}
	};

	useEffect(() => {
		fetchTeams();
	}, []);

	const fetchTeams = async () => {
		try {
			const { data, error } = await supabase
				.from("teams")
				.select(
					`
          id,
          name,
          logo_url,
          players (id, name, number, position, is_active)
        `
				)
				.eq("players.is_active", true);

			if (error) throw error;
			setTeams(data || []);
		} catch (err) {
			toast({
				title: "Error",
				description: "Failed to fetch teams",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const addPlayer = async (teamId) => {
		try {
			const { data, error } = await supabase
				.from("players")
				.insert([
					{
						team_id: teamId,
						name: newPlayer.name,
						number: newPlayer.number,
						position: newPlayer.position,
						is_active: true,
					},
				])
				.select();

			if (error) throw error;

			setNewPlayer({ name: "", number: "", position: "" });
			fetchTeams();
			toast({
				title: "Success",
				description: "Player added successfully",
			});
		} catch (err) {
			toast({
				title: "Error",
				description: "Failed to add player",
				variant: "destructive",
			});
		}
	};

	if (loading) return <div className="p-4">Loading teams...</div>;

	return (
		<div className="p-4 space-y-6">
			<h2 className="text-2xl font-bold text-[#F3F4F6]">Team Management</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{teams.map((team) => (
					<Card
						key={team.id}
						className="bg-[#1F2937] border-[#1E3A8A] text-[#F3F4F6] p-6"
					>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-semibold">{team.name}</h3>
							<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										className="bg-[#374151] hover:bg-[#4B5563] text-[#F3F4F6] border-[#1E3A8A]"
										onClick={() => {
											setEditingPlayer(null);
											setPlayerData({ name: "", number: "", position: "" });
										}}
									>
										Add Player
									</Button>
								</DialogTrigger>
								<DialogContent className="bg-[#1F2937] text-[#F3F4F6]">
									<DialogHeader>
										<DialogTitle>
											{editingPlayer
												? `Edit Player - ${team.name}`
												: `Add New Player to ${team.name}`}
										</DialogTitle>
									</DialogHeader>
									<div className="space-y-4">
										<Input
											placeholder="Player Name"
											value={playerData.name}
											onChange={(e) =>
												setPlayerData({ ...playerData, name: e.target.value })
											}
											className="bg-[#374151] text-[#F3F4F6] border-[#1E3A8A]"
										/>
										<Input
											placeholder="Number"
											value={playerData.number}
											onChange={(e) =>
												setPlayerData({ ...playerData, number: e.target.value })
											}
											className="bg-[#374151] text-[#F3F4F6] border-[#1E3A8A]"
										/>
										<Input
											placeholder="Position"
											value={playerData.position}
											onChange={(e) =>
												setPlayerData({
													...playerData,
													position: e.target.value,
												})
											}
											className="bg-[#374151] text-[#F3F4F6] border-[#1E3A8A]"
										/>
										<Button
											onClick={() => handleSubmit(team.id)}
											className="w-full bg-[#1E3A8A] hover:bg-[#2563EB] text-[#F3F4F6]"
										>
											{editingPlayer ? "Update Player" : "Add Player"}
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>
						<div className="space-y-2">
							{team.players?.map((player) => (
								<div
									key={player.id}
									className="flex items-center justify-between p-2 rounded bg-[#374151] hover:bg-[#4B5563]"
								>
									<div className="flex items-center justify-between w-full">
										<div className="flex items-center space-x-2">
											<span className="font-mono">{player.number}</span>
											<span>{player.name}</span>
											<span className="text-sm text-[#9CA3AF]">
												{player.position}
											</span>
										</div>
										<Button
											variant="outline"
											size="sm"
											className="bg-[#374151] hover:bg-[#4B5563] text-[#F3F4F6] border-[#1E3A8A]"
											onClick={() => {
												setEditingPlayer(player);
												setPlayerData({
													name: player.name,
													number: player.number,
													position: player.position,
												});
												setIsDialogOpen(true);
											}}
										>
											Edit
										</Button>
									</div>
								</div>
							))}
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
