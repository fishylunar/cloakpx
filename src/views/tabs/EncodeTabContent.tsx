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
import { Skeleton } from "@/components/ui/skeleton";
import { encode, encodeRequest } from "@/logic/imageHandler";
import {saveAs} from 'file-saver';
function EncodeTabContent() {
	const [encodeButtonDisabled, setEncodeButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");

	const convertToJPEG = (file: File): Promise<File> => {
		return new Promise((resolve, reject) => {
			// Create an image element
			const img = new Image();

			// Create a canvas element
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			// When image loads, draw it to canvas and convert
			img.onload = () => {
				// Set canvas size to match image
				canvas.width = img.width;
				canvas.height = img.height;

				// Draw image onto canvas
				if (ctx) {
					ctx.drawImage(img, 0, 0);

					// Convert canvas to blob
					canvas.toBlob(
						(blob) => {
							if (blob) {
								// Create new file from blob
								const jpegFile = new File([blob], "converted.jpg", {
									type: "image/jpeg",
									lastModified: new Date().getTime(),
								});
								resolve(jpegFile);
							} else {
								reject(new Error("Failed to convert to JPEG"));
							}
						},
						"image/jpeg",
						0.95
					); // 0.95 is the quality (0-1)
				}
			};

			img.onerror = () => {
				reject(new Error("Failed to load image"));
			};

			// Create object URL from file and set as image source
			img.src = URL.createObjectURL(file);
		});
	};

	const handleEncode = async () => {
		const fileInput = document.getElementById(
			"picture"
		) as HTMLInputElement | null;

		if (!fileInput) {
			return;
		}

		const inputFile = fileInput.files?.[0];
		const jpegFile = await convertToJPEG(inputFile!);
		const file = jpegFile;

		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.onload = () => {
			const fileBuffer = reader.result as ArrayBuffer | string;
			const encodeRequest: encodeRequest = {
				imageBuffer: fileBuffer,
				secret: (document.getElementById("secret") as HTMLInputElement).value,
				receiver: (document.getElementById("receiver") as HTMLInputElement)
					.value,
				sender: (document.getElementById("sender") as HTMLInputElement).value,
				messageToEncode: (
					document.getElementById("messageToEncode") as HTMLInputElement
				).value,
			};
			const newImageB64 = encode(encodeRequest);
			setLoading(false);
			setEncodeButtonDisabled(true);
			setMessage(newImageB64);
		};

		reader.readAsArrayBuffer(file);
	};

	const downloadImage = () => {
		saveAs(message, 'image.jpg') // Put your image URL here.
	  }

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Encode Message</CardTitle>
					<CardDescription>
						Encode the hidden message in the picture you received
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
						<Label className="text-left" htmlFor="messageToEncode">
							Message To Encode
						</Label>
						<Input type="text" id="messageToEncode" placeholder="Message" />
					</div>

					<div className="grid w-full max-w-sm items-center gap-1.5 pb-4">
						<Label className="text-left" htmlFor="picture">
							Picture
						</Label>
						<Input
							id="picture"
							type="file"
							onChange={() => {
								setEncodeButtonDisabled(false);
							}}
						/>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className="w-full rounded-xl"
						onClick={handleEncode}
						disabled={encodeButtonDisabled}
					>
						Encode
					</Button>
				</CardFooter>
				<CardFooter>
					<div className="grid w-full gap-1.5">
						<Label className="text-left" htmlFor="message">
							Encoded Message
						</Label>
						{loading ? (
							<Skeleton className="h-[125px] w-full rounded-xl" />
						) : (
							<>
							<Label className="text-left text-slate-400">
								Click the image to save it.
								</Label>
							<img className="rounded-xl" onClick={downloadImage} alt="Image with encoded secret" src={`${message}`} />
							</>
							)
						}
					</div>
				</CardFooter>
			</Card>
		</>
	);
}

export default EncodeTabContent;
