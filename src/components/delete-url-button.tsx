"use client";
import { getAppRoute } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { revalidateSummary } from "@/app/[locale]/actions/dashboard/dashboard";
import { useTranslations } from "next-intl";

type Props = {
	id: string;
};

export default function DeleteUrlButton({ id }: Props) {
	const router = useRouter();
	const t = useTranslations("dashboard");

	const deleteUrl = async () => {
		try {
			const response = await fetch(getAppRoute(`api/v1/urls/${id}`), {
				credentials: "include",
				method: "DELETE",
			});
			if (response.status != 200) {
				toast(`Unable to delete URL "${id}"`);
				throw new Error(
					`Unable to delete url ${id} - ${JSON.stringify(
						{
							status: response.status,
							body: await response.text(),
						},
						null,
						2,
					)}`,
				);
			}

			revalidateSummary();
			router.push(getAppRoute("dashboard"));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Button
			onClick={deleteUrl}
			className="right-2 bottom-6 z-10 me-4 h-12 max-lg:h-10 max-sm:fixed max-sm:size-18 max-sm:rounded-full"
		>
			<span className="max-sm:hidden">{t("delete_url_button")}</span>
			<Trash2 className="max-sm:scale-150" />
		</Button>
	);
}
