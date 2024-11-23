# CloakPX

A web application for encoding and decoding secret messages in images.

### Features

- Encode and decode hidden messages inside images using exif data
- User-friendly interface with tabs for easy navigation
- Supports multiple image formats

## How it works

A key is generated from 4 parts: Sender Username, Receiver Username, Today's
Date, and a Shared Secret (By using today's date we add a soft expiry date for
messages. however it would not be hard to bypass if you know the date of when
the message was hidden.)

The key is structured like so:

```plaintext
MD5 of {
	sha256 of the usernames (sender-receiver)
	-
	sha256 of the shared secret
	-
	sha256 of current date (DDMMYYY)
	}
```

We then use the created key to AES-256 encrypt / decrypt the message before
hiding it in the image.

### Hiding the encrypted message

The encrypted message is hidden inside the provided image's EXIF data, Do keep
in mind that most social media platforms strip images from EXIF data before they
get uploaded - So make sure to share the images with hidden messages on
platforms where EXIF data is left intact (Like SMS).

When an image is uploaded, we start with converting it to JPEG so we can work
with it and it's EXIF data. Then removing existing EXIF data for privacy reasons

Then we hide the encrypted message in the "LensMake" EXIF data property.

## Technologies Used

- React for the frontend
- Vite as the build tool
- Tailwind CSS for styling
- TypeScript
- Piexifjs
- Crypto-JS
- shadcn/ui
