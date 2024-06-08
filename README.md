### CloakPx

CloakPx is a privacy-focused message encryption and decryption tool. It ensures absolute anonymity by allowing users to communicate securely without revealing personal information. Messages are encrypted and hidden in the EXIF data of images, which can be shared through any medium, maintaining security and privacy.

### Features

- 100% anonymous, no sign-ups, accounts, verifications, simply type in an alias whenever you use it.
- Strong Encryption: Messages are encrypted with AES-256-CBC encryption to ensure privacy, and keep your messages from prying eyes.
- Hidden in plain sight: Encrypted messages are hidden inside the EXIF data of images which allows you to send your hidden messages without it looking suspicious to others, as they'll just see a normal picture.
- 100% Local: No data gets stores, or leaves your device. It even works offline!
- iOS Shortcut: A version made for Siri Shortcuts to make encrypting & decrypting of hidden messages easy for iOS users.

**Table of Contents**

[TOC]


### 1. Introduction

In an age where digital privacy is paramount, CloakPx offers a robust solution for secure communication. By utilizing advanced encryption algorithms and innovative data storage methods, CloakPx ensures that messages remain confidential and accessible only to intended recipients.

### 2. User Identification

Instead of requiring emails, phone numbers, or any unique identifiers, the user will be asked to provide a "handle", it can be whatever they want. Keep in mind there's no verification involved, so everyone can use the same handle if they wish.

### 3. Shared Pass

The "Shared Pass" is a secret known only to both the sender and the receiver, ensuring the security and validity of the messages. It is crucial to share this pass through secure methods, preferably face-to-face, to avoid compromise.

#### Tips for Secure Shared Pass
- Avoid number-only passwords.
- Use a good length; not too long, not too short.
- Include symbols, uppercase and lowercase characters, and numbers.
- Ensure it’s memorable by both parties.
- Don’t reuse the shared pass with other users.

### 4. Date-based Encryption

Including the current date in the format DDMMYY adds an extra layer of obfuscation, ensuring that messages expire if the date doesn’t match. This makes it harder to decrypt the message without knowing the date it was sent.

### 5. Encryption and Decryption Flow

#### Encryption Flow
Generate Key: Combine the Base64 encoded string of user1_handle+user2_handle, SHA256 hash of the shared pass, and SHA256 hash of the current date.
Encrypt Data: Use the key to encrypt the message with AES-256-CBC.
Embed in EXIF Data: Hide the encrypted message in the EXIF data of a randomly retrieved image.
Share Image: Prompt the user to share the image containing the encrypted message.

#### Decryption Flow
Generate Key: Use the same user-provided information to generate the decryption key.
Extract and Decrypt: Extract the encrypted message from the EXIF data and decrypt it using the generated key.

### 6. Key Generation

Keys are generated using a combination of user-provided IDs, a shared pass, and the current date. This multi-factor approach ensures that only individuals with all the correct inputs can decrypt the message.

### 7. Message Handling

#### Sending Messages
User Info: Provide your UserID, the recipient’s UserID, and the shared pass.
Encryption Process: The tool generates the key, encrypts the message, and hides it in the EXIF data of an image.
Share Image: The image is then shared with the recipient.

#### Receiving Messages
User Info: Provide your UserID, the sender’s UserID, and the shared pass.
Decryption Process: The tool extracts the encrypted message from the EXIF data and decrypts it using the generated key.

### 8. Offline Functionality

CloakPx is designed to work entirely offline. For Android users, an HTML Viewer app is required to render the HTML page. This approach ensures that no data leaves the user's device, enhancing security and privacy.

#### For iOS users:
There is a version of CloakPx for Shortcuts, which makes it easy to encrypt & decrypt messages.

### 9. Libraries Used

- [SJCL](http://bitwiseshiftleft.github.io/sjcl/ "SJCL") (Stanford JavaScript Crypto Library): For handling cryptographic functions.
- [jshashes](https://github.com/h2non/jshashes?tab=readme-ov-file "jshashes"): For hashing operations.
- [piexifjs](https://github.com/hMatoba/piexifjs "piexifjs"): For modifying EXIF metadata.
