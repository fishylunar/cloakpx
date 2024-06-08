/**
 * Handles the inputs, and the main flow of the app
 * @param {string} base64_image Input image as a base64 string
 */
function inputHandler(base64_image) {
    let base64_encoded_image = `${base64_image}`

    // Collect handles and the shared pass
    let user1_handle = prompt("Please enter your handle.")
    let user2_handle = prompt("Please type in the other person's handle.")
    let shared_pass = prompt("Please type in the Shared Pass you & the other person know.")

    // Select mode
    let mode;
    switch (confirm("Press OK to encrypt, or press Cancel to decrypt")) {
        case true:
            mode = "encrypt"
            break;
        case false:
            mode = "decrypt"
            break;
        default:
            throw new Error("Invalid mode from input handler.")
            break;
    }

    // Handle input we collected
    let input_message;
    switch (mode) {
        case "encrypt": // If encrypt, ask for the desired message to encrypt.
            input_message = prompt("Please type in the message you want to send.")

            let encrypted_string = cryptoHandler({
                user1_handle,
                user2_handle,
                shared_pass,
                mode,
                input_message
            }).output

            let output_image_b64 = imageHandler({
                image: base64_encoded_image,
                mode,
                input_message: encrypted_string
            })

            alert("You can now share the image containing the hidden encrypted message.")
            document.write(`<img src="${"data:image/jpeg;base64," + output_image_b64}"></img>`)
            break;

        case "decrypt":
            input_message = "decrypt_mode"

            let extracted_string = imageHandler({
                image: base64_encoded_image,
                mode,
                input_message: "decrypt_mode"
            })

            const decrypted_string = cryptoHandler({
                user1_handle,
                user2_handle,
                shared_pass,
                mode,
                input_message: extracted_string
            })

            alert("Decrypted message:\n" + decrypted_string.output)
            break;

        default:
            throw new Error("Invalid mode from input handler.")
            break;
    }
}

/**
 * Sets up the event listener for the file input dialog
 */
function loader() {
    document.getElementById('fileInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const base64String = e.target.result;
                inputHandler(base64String.replace("data:image/jpeg;base64,", ""))
            };
            reader.readAsDataURL(file);
        }
    });
}

// Run the loader function when loaded.
window.onload = loader();

/**
 * Image handler - Inserts & extracts encrypted strings into image EXIF data.
 * @param {object} options Config object for the image handler.
 * @param {string} options.image Image encoded as a Base64 string.
 * @param {string} options.mode either "encrypt" or "decrypt"
 * @param {string} options.input_message Contains the encrypted string to hide in the image, or "decrypt_mode"
 */
function imageHandler(options = {
    image: string,
    mode: string,
    input_message: string
}) {
    switch (options.mode) {
        case "encrypt":
            var exif = {};

            exif[piexif.ExifIFD.LensMake] =
                options.input_message
            var exifObj = {
                "0th": {},
                "Exif": exif,
                "GPS": {}
            };

            var exifbytes = piexif.dump(exifObj);
            var inserted = piexif.insert(exifbytes, piexif.remove("data:image/jpeg;base64," + options.image));
            return inserted.replace("data:image/jpeg;base64,", "")
            break;


        case "decrypt":
            var exif = piexif.load("data:image/jpeg;base64," + options.image);
            console.dir(exif)
            delete exif["1st"]
            delete exif["thumbnail"]

            let secret = "false"
            for (var ifd in exif) {
                if (ifd == "thumbnail") {
                    continue;
                } else {
                    if (ifd == "1st") {
                        continue;
                    } else {
                        for (var tag in exif[ifd]) {
                            if (piexif.TAGS[ifd][tag]["name"] === "LensMake") {
                                secret = exif[ifd][tag]
                            }
                        }
                    }
                }
            }
            return secret
            break;
    }

}

/**
 * Encrypts & decrypts data
 * @param {object} options Config object for the crypto handler.
 * @param {string} options.user1_handle Handle / ID of the first user.
 * @param {string} options.user2_handle Handle / ID of the second user.
 * @param {string} options.shared_pass Shared Pass.
 * @param {string} options.mode Either "encrypt" or "decrypt".
 * @param {string} options.input_message String to encrypt or decrypt.
 */
function cryptoHandler(options = {
    user1_handle: string,
    user2_handle: string,
    shared_pass: string,
    mode: string,
    input_message: string,
}) {
    // Sort the handles in alphabetical order.
    let handleArray = [options.user1_handle, options.user2_handle]
    let handleArraySorted = handleArray.sort()
    let user1_handle = handleArraySorted[0].toString()
    let user2_handle = handleArraySorted[1].toString()

    // Hash handles
    let hashed_handles = new Hashes.SHA256().hex(`${user1_handle}+${user2_handle}`)

    let today = new Date()
    // Get day, month, and year from the date
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();

    // Format the date as "DD/MM/YYYY"
    const formattedDate = `${day}${month}${year}`;
    // Hash date
    let hashed_date = new Hashes.SHA256().hex(`${formattedDate}`)

    // Hash shared pass
    let hashed_pass = new Hashes.SHA256().hex(options.shared_pass)

    // Make key
    let key = btoa(new Hashes.MD5().hex(`${hashed_handles}-${hashed_pass}-${hashed_date}`))
    options.key = key

    function each(o, callback) {
        if (Array.isArray(o)) {
            for (var i = 0; i < o.length; i++)
                o[i] = callback(o[i]);
        } else {
            var ar = Object.getOwnPropertyNames(o);
            for (var i = 0; i < ar.length; i++)
                o[ar[i]] = callback(o[ar[i]]);
        }
        return o;
    }

    if (!Array.isArray(options.input_message) && typeof options.input_message !== "object") {
        options.input_message = [options.input_message];
    }
    options.isPassword = !!+options.isPassword;
    if (!options.isPassword && options.key) {
        options.key = sjcl.codec.base64.toBits(options.key);
    }

    var res = {};

    try {
        switch (options.mode) {
            case "encrypt":
                res = each(options.input_message, function (d) {
                    return btoa(sjcl.encrypt(options.key, d));
                });
                break;
            case "decrypt":
                res = each(options.input_message, function (d) {
                    return sjcl.decrypt(options.key, atob(d));
                });
                break;
            default:
                throw new Error("Invalid mode from cryptoHandler")
                break;
        }

        if (typeof res === "string") {
            res = [res];
        }
        if (Array.isArray(res)) {
            res = {
                "<^|$>": res
            };
        }
    } catch (ex) {
        throw new Error(ex)
    } finally {
        const output = {
            output: Object.values(res)[0][0]
        };
        return output;
    }
}