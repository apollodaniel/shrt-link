"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronUp, User2 } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";
import { User } from "@/lib/types/api";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserDropdownMenu({ user }: { user: User }) {
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const logout = async () => {
		try {
			const response = await fetch("/api/v1/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			if (response.ok || response.status == 200) {
				router.push("/");
			} else {
				toast(
					"An error ocurred when trying to logout, try again later.",
				);
				throw new Error(await response.text());
			}
		} catch (err) {
			console.log(err.message);
		}

		setIsDialogOpen(false);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton>
						<User2 /> {user.email}
						<ChevronUp className="ml-auto" />
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					side="top"
					align="center"
					className="mx-auto w-[var(--global-sidebar-width)] max-w-[90%]" // Ensures it matches sidebar width
				>
					<DropdownMenuItem>
						<span>Account</span>
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Dialog
				open={isDialogOpen}
				onOpenChange={(open) => setIsDialogOpen(open)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Logout</DialogTitle>
						<DialogDescription>
							Are you sure you want to logout?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="destructive" onClick={() => logout()}>
							Logout
						</Button>
						<Button
							variant="outline"
							onClick={() => setIsDialogOpen(false)}
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
