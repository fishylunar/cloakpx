import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { decode, decodeRequest } from "@/logic/imageHandler";
import { toast } from "@/hooks/use-toast"

function DecodeTabContent() {
	const [decodeButtonDisabled, setDecodeButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");

	const handleMessageChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setMessage(event.target.value);
		setLoading(false);
	};

	const handleDecode = () => {
		const fileInput = document.getElementById(
			"picture"
		) as HTMLInputElement | null;
		if (!fileInput) {
			return;
		}

		const file = fileInput.files?.[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const fileBuffer = reader.result as ArrayBufferLike | string;

			const decodeRequest: decodeRequest = {
				imageBuffer: fileBuffer as ArrayBufferLike,
				secret: (document.getElementById("secret") as HTMLInputElement).value,
				receiver: (document.getElementById("receiver") as HTMLInputElement)
					.value,
				sender: (document.getElementById("sender") as HTMLInputElement).value
			};
			let decodedMessage = "";
			
			try {
				decodedMessage = decode(decodeRequest) as string;
			} catch (error) {
				console.error(error);
				return toast({
					description: "Error! - No secret found in the image",
				  })
			}

			setMessage(decodedMessage);
			setDecodeButtonDisabled(true);
			setLoading(false);
		};
		reader.readAsArrayBuffer(file);
	};
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Decode Message</CardTitle>
					<CardDescription>
						Decode the hidden message in the picture you received
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid w-full max-w-sm items-center gap-1.5 pb-4">
						<Label className="text-left" htmlFor="from">
							From
						</Label>
						<Input type="text" id="sender" placeholder="From (Username)" />
					</div>

					<div className="grid w-full max-w-sm items-center gap-1.5 pb-4">
						<Label className="text-left" htmlFor="to">
							To
						</Label>
						<Input type="text" id="receiver" placeholder="To (Your Username)" />
					</div>

					<div className="grid w-full max-w-sm items-center gap-1.5 pb-4">
						<Label className="text-left" htmlFor="secret">
							Shared Secret
						</Label>
						<Input type="password" id="secret" placeholder="Shared Secret" />
					</div>

					<div className="grid w-full max-w-sm items-center gap-1.5 pb-4">
						<Label className="text-left" htmlFor="picture">
							Picture
						</Label>
						<Input
							id="picture"
							type="file"
							onChange={() => {
								setDecodeButtonDisabled(false);
							}}
						/>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className="w-full rounded-xl"
						onClick={handleDecode}
						disabled={decodeButtonDisabled}
					>
						Decode
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="grid w-full gap-1.5">
						<Label className="text-left" htmlFor="message">
							Decoded Message
						</Label>
						{loading ? (
							<Skeleton className="h-[125px] w-full rounded-xl" />
						) : (
							<Textarea
								placeholder="Decoded message ends up here"
								id="message"
								value={message}
								onChange={handleMessageChange}
							/>
						)}
					</div>
				</CardFooter>
			</Card>
		</>
	);
}

export default DecodeTabContent;
