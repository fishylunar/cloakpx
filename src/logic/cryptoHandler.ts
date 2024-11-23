import * as CryptoJS from 'crypto-js';
interface CryptographyOptions {
	sender: string;
	receiver: string;
	shared_secret: string;
	data: string; // Either the encrypted message, or the message to encrypt
	mode: 'encrypt' | 'decrypt';
}
interface KeyOptions {
	sender: string;
	receiver: string;
	shared_secret: string;
}

function cryptoHandler(opt: CryptographyOptions) {
	// Get key
	const KeyOptions: KeyOptions = {
		sender: opt.sender,
		receiver: opt.receiver,
		shared_secret: opt.shared_secret,
	};
	const key = generateKey(KeyOptions);

	if (opt.mode === 'encrypt') {
		// encrypt message
		const cipher = CryptoJS.AES.encrypt(opt.data, key);
		return cipher.toString();
	} else if (opt.mode === 'decrypt') {
		// decrypt message
		const bytes = CryptoJS.AES.decrypt(opt.data, key);
		const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
		return decryptedMessage;
	}
}

function generateKey(opt: KeyOptions): string {
	// get sha256 of sender and receiver
	const sender_receiver_hash = CryptoJS.SHA256(
		`${opt.sender}+${opt.receiver}`
	).toString(CryptoJS.enc.Hex);

	// get sha256 of shared secret
	const shared_secret_hash = CryptoJS.SHA256(`${opt.shared_secret}`).toString(
		CryptoJS.enc.Hex
	);

	// Get current date as DDMMYYYY, then get the hash of that
	const date = new Date();
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear().toString();
	const date_hash = CryptoJS.SHA256(`${day}${month}${year}`).toString(
		CryptoJS.enc.Hex
	);

	// Get MD5 of sender_receiver_hash + shared_secret_hash + date_hash
	const key = CryptoJS.MD5(
		`${sender_receiver_hash}-${shared_secret_hash}-${date_hash}`
	).toString(CryptoJS.enc.Hex);

	return key;
}

export type { CryptographyOptions };
export { cryptoHandler };
