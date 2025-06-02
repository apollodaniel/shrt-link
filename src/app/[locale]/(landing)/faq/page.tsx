import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Gift, Leaf, Repeat, ShieldCheck, Timer, Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

type Question = {
	icon: ReactNode;
	question: string;
	answer:
		| string
		| {
				description: string;
				conditions: string[];
		  };
};

export default async function Faq() {
	const t = await getTranslations("landing_faq");
	const questions: Question[] = [
		<ShieldCheck
			key="shield-icon"
			className="text-primary mr-2 inline-block h-5 w-5"
		/>,
		<Truck
			key="truck-icon"
			className="text-primary mr-2 inline-block h-5 w-5"
		/>,
		<Leaf
			key="leaf-icon"
			className="text-primary mr-2 inline-block h-5 w-5"
		/>,
		<Repeat
			key="repeat-icon"
			className="text-primary mr-2 inline-block h-5 w-5"
		/>,
		<Gift
			key="gift-icon"
			className="text-primary mr-2 inline-block h-5 w-5"
		/>,
		<Timer
			key="timer-icon"
			className="text-primary mr-2 inline-block h-5 w-5"
		/>,
	].map((icon, i) => {
		return {
			icon,
			...t.raw(`questions.item_${i + 1}`),
		};
	});

	return (
		<div
			id="faq"
			className="flex h-[90vh] min-h-[100vh] flex-col items-center justify-center gap-8 px-16 py-12 max-md:gap-4 max-md:px-4 max-md:py-8"
		>
			<h1 className="text-center text-[36px] font-bold max-sm:text-[24px]">
				{t("title")}
			</h1>
			<p className="w-full max-w-[800px]">{t("description")}</p>
			<div className="flex w-full max-w-[800px] flex-row flex-wrap items-center justify-center gap-3">
				<Accordion type="single" collapsible className="w-full">
					{questions.map(({ icon, question, answer }, index) => (
						<AccordionItem
							key={`item-${index + 1}`}
							value={`item-${index + 1}`}
						>
							<AccordionTrigger>
								<div className="flex items-center">
									{icon}
									<span>{question}</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								{typeof answer == "string" ? (
									answer
								) : (
									<>
										{answer.description}
										<ul className="mt-2 list-disc pl-5">
											{answer.conditions.map(
												(text, i) => (
													<li key={`condition-${i}`}>
														{text}
													</li>
												),
											)}
										</ul>
									</>
								)}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
}
