var upload = document.querySelector(".upload");

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

// Obsługa kliknięcia inputów tekstowych
document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    });
});

// Obsługa kliknięcia na kontener uploadu
upload.addEventListener('click', () => {
    imageInput.click();
});

// 🟨 OBSŁUGA ZMIANY ZDJĘCIA
imageInput.addEventListener('change', async (event) => {
    var file = imageInput.files[0];

    // ✅ Sprawdzenie rozmiaru pliku
    if (file.size > 1024 * 1024) {
        alert("Plik jest za duży. Maksymalnie 1MB.");
        return;
    }

    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    try {
        // ✅ Kompresja obrazu do 300x300 px przez canvas
        var compressedBlob = await compressImage(file, 300, 300);
        var data = new FormData();
        data.append("image", compressedBlob);

        // ✅ Upload do Imgur z obsługą błędu
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': 'Client-ID 4ecc257cbb25ccc'
            },
            body: data
        });

        const result = await response.json();

        if (!result.success) throw new Error("Upload failed");

        var url = result.data.link;
        upload.classList.remove("error_shown");
        upload.setAttribute("selected", url);
        upload.classList.add("upload_loaded");
        upload.classList.remove("upload_loading");
        upload.querySelector(".upload_uploaded").src = url;

    } catch (error) {
        alert("Błąd podczas uploadu zdjęcia. Sprawdź internet i spróbuj ponownie.");
        upload.classList.remove("upload_loading");
        console.error(error);
    }
});

// 🟨 PRZYCISK "GO" – sprawdza czy wszystkie dane są poprawne
document.querySelector(".go").addEventListener('click', () => {
    var empty = [];
    var params = new URLSearchParams();

    if (!upload.hasAttribute("selected")) {
        empty.push(upload);
        upload.classList.add("error_shown");
    } else {
        params.append("image", upload.getAttribute("selected"));
    }

    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        params.append(input.id, input.value);

        if (isEmpty(input.value)) {
            empty.push(element);
            element.classList.add("error_shown");
        }
    });

    if (empty.length != 0) {
        empty[0].scrollIntoView();
    } else {
        forwardToId(params);
    }
});

// Sprawdza czy pole jest puste
function isEmpty(value) {
    let pattern = /^\s*$/;
    return pattern.test(value);
}

// Przekierowanie z parametrami
function forwardToId(params) {
    location.href = "/id?" + params;
}

// 🟨 PRZEŁĄCZANIE ROZWIJANIA POMOCY
var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {
    guide.classList.toggle("unfolded");
});

// 🟨 FUNKCJA KOMPRESUJĄCA ZDJĘCIE DO 300x300 (MAX)
function compressImage(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");

                let ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, "image/jpeg", 0.8);
            };
            img.onerror = reject;
            img.src = event.target.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
