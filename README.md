# CloakPX

A web application for encoding and decoding secret messages in images.

<div align="center">
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" title="Node.js"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" alt="TypeScript" title="TypeScript"/></code>
	<code><img width="50" src="https://github-production-user-asset-6210df.s3.amazonaws.com/62091613/261395532-b40892ef-efb8-4b0e-a6b5-d1cfc2f3fc35.png" alt="Vite" title="Vite"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" title="React"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/202896760-337261ed-ee92-4979-84c4-d4b829c7355d.png" alt="Tailwind CSS" title="Tailwind CSS"/></code>
	<code><img width="50" src="https://github.com/user-attachments/assets/e4bd419a-2a4a-459a-ba9a-d3324e693c4d" alt="ShadCn UI" title="ShadCn UI"/></code>
</div>

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
