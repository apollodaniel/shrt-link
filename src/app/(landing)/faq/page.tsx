import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Gift, Leaf, Repeat, ShieldCheck, Timer, Truck } from "lucide-react";

export default function Faq() {
	return (
		<div
			id="faq"
			className="flex h-[90vh] min-h-[100vh] flex-col items-center justify-center gap-8 px-16 py-12 max-md:gap-4 max-md:px-4 max-md:py-8"
		>
			<h1 className="text-center text-[36px] font-bold max-sm:text-[24px]">
				Frequently asked questions
			</h1>
			<p className="w-full max-w-[800px]">
				We&apos;ve compiled the most important information to help you
				get the most out of your experience. Can&apos;t find what
				you&apos;re looking for? Contact us.
			</p>
			<div className="flex w-full max-w-[800px] flex-row flex-wrap items-center justify-center gap-3">
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="item-1">
						<AccordionTrigger>
							<div className="flex items-center">
								<ShieldCheck className="text-primary mr-2 inline-block h-5 w-5" />
								<span>Is the service secure?</span>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							While we don&apos;t scan for malware, all links are
							generated without storing sensitive user data.
							Please use the service responsibly.
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-2">
						<AccordionTrigger>
							<div className="flex items-center">
								<Truck className="text-primary mr-2 inline-block h-5 w-5" />
								<span>How fast are links created?</span>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							Links are generated instantly. Note that you&apos;ll
							need an account to use the service.
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-3">
						<AccordionTrigger>
							<div className="flex items-center">
								<Leaf className="text-primary mr-2 inline-block h-5 w-5" />
								<span>Do links expire?</span>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							Yes. In this test deployment, links expire after 5
							minutes to prevent storing sensitive data and
							maintain a clean, optimized testing environment for
							all users.
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-4">
						<AccordionTrigger>
							<div className="flex items-center">
								<Repeat className="text-primary mr-2 inline-block h-5 w-5" />
								<span>
									What data is collected when a link is
									accessed?
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							For each visit, we collect the IP address and user
							agent. From this information, we determine the
							browser, device type, and approximate location
							(including country, region, city, and coordinates).
							During testing, for legal and security reasons, all
							requests are recorded with the server&apos;s IP
							address instead of the user&apos;s actual IP. This
							data is associated with the specific shortened URL
							and includes the access timestamp.
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-5">
						<AccordionTrigger>
							<div className="flex items-center">
								<Gift className="text-primary mr-2 inline-block h-5 w-5" />
								<span>Is the service really free?</span>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							Yes. The service is completely free—there are no
							subscriptions or hidden charges.
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-6">
						<AccordionTrigger>
							<div className="flex items-center">
								<Timer className="text-primary mr-2 inline-block h-5 w-5" />
								<span>How long does an account last?</span>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							These rules apply only to this test website&apos;s
							trial mode. Accounts expire under these conditions:
							<ul className="mt-2 list-disc pl-5">
								<li>
									Inactive accounts (with no URLs or clicks)
									expire after 10 minutes
								</li>
								<li>
									Active accounts without clicks expire after
									15 minutes
								</li>
								<li>
									Accounts with active clicks remain active
									until 5 minutes pass without new clicks (but
									never exceed the 15-minute maximum for
									active accounts)
								</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}
