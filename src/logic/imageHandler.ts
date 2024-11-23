import * as piexif from 'piexifjs';
import { CryptographyOptions, cryptoHandler } from './cryptoHandler';
interface decodeRequest {
	imageBuffer: ArrayBuffer | ArrayBufferLike;
	secret: string;
	receiver: string;
	sender: string;
}

interface encodeRequest {
	messageToEncode: string;
	imageBuffer: string | ArrayBuffer;
	secret: string;
	receiver: string;
	sender: string;
}

function getSecretMessageFromImage(imageBuffer: ArrayBufferLike): string {
	const imageB64 = btoa(
		new Uint8Array(imageBuffer).reduce(function (data, byte) {
			return data + String.fromCharCode(byte);
		}, '')
	);

	const exif = piexif.load('data:image/jpeg;base64,' + imageB64);

	let secret = 'false';
	for (const ifd in exif) {
		if (ifd == 'thumbnail') {
			continue;
		}
		for (const tag in exif[ifd]) {
			if (piexif.TAGS[ifd][tag]['name'] === 'LensMake') {
				secret = exif[ifd][tag];
			}
		}
	}

	return secret;
}
function decode(opt: decodeRequest): Error | string {
	console.log(opt);
	const secret = getSecretMessageFromImage(opt.imageBuffer) as string;
	if (secret === 'false') throw new Error('No secret found in image');

	// Decrypt the message
	const CryptoHandlerOptions: CryptographyOptions = {
		sender: opt.sender,
		receiver: opt.receiver,
		shared_secret: opt.secret,
		data: secret,
		mode: 'decrypt',
	};

	const decryptedMessage = cryptoHandler(CryptoHandlerOptions) as string;

	return decryptedMessage;
}

function encodeSecretInImage(opt: encodeRequest) {
	// Convert our image (bufferarray) to the jpeg type before converting it to base64

	const imageB64 = btoa(
		new Uint8Array(opt.imageBuffer as ArrayBufferLike).reduce(function (
			data,
			byte
		) {
			return data + String.fromCharCode(byte);
		},
		'')
	);

	const exif: { [key: string]: string | undefined } = {};

	// Encrypt the message to encode
	const CryptographyOptions: CryptographyOptions = {
		sender: opt.sender,
		receiver: opt.receiver,
		shared_secret: opt.secret,
		data: opt.messageToEncode,
		mode: 'encrypt',
	};

	exif[piexif.ExifIFD.LensMake] = cryptoHandler(CryptographyOptions);
	const exifObj = {
		'0th': {},
		Exif: exif,
		GPS: {},
	};

	const exifbytes = piexif.dump(exifObj);
	const inserted = piexif.insert(
		exifbytes,
		piexif.remove('data:image/jpeg;base64,' + imageB64)
	);

	return inserted;
}
function encode(opt: encodeRequest) {
	const newImageB64 = encodeSecretInImage(opt);
	return newImageB64;
}

export type { decodeRequest, encodeRequest };
export { decode, encode };
