class Coloors {
    constructor() {
        // Globals selections and variables
        this.colourDivs = document.querySelectorAll(".colour");
        this.generateBtn = document.querySelector(".generate");
        this.sliders = document.querySelectorAll('input[type="range"]');
        this.currentHexes = document.querySelectorAll(".colour h2");
        this.popup = document.querySelector(".copy-container");
        this.adjustBtn = document.querySelectorAll(".adjust");
        this.lockBtn = document.querySelectorAll(".lock");
        this.closeAdjustments = document.querySelectorAll(".close-adjustment");
        this.sliderContainers = document.querySelectorAll(".sliders");
        this.initialColours;

        // Local storage
        this.savedPalettes = [];

        // Implement Save to palette and LOCAL STORAGE STUFF
        this.saveBtn = document.querySelector(".save");
        this.submitSave = document.querySelector(".submit-save");
        this.closeSave = document.querySelector(".close-save");
        this.saveContainer = document.querySelector(".save-container");
        this.saveInput = document.querySelector(".save-container input");
        this.libraryContainer = document.querySelector(".library-container");
        this.libraryBtn = document.querySelector(".library");
        this.closeLibraryBtn = document.querySelector(".close-library");

        this.eventListeners();
    }

    eventListeners() {
        this.generateBtn.addEventListener("click", this.randomColours);

        this.sliders.forEach((slider) => {
            slider.addEventListener("input", this.hslControls);
        });

        this.colourDivs.forEach((slider, index) => {
            slider.addEventListener("change", () => {
                this.updateTextUI(index);
            });
        });

        this.currentHexes.forEach((hex) => {
            hex.addEventListener("click", () => {
                this.copyToClipboard(hex);
            });
        });

        this.adjustBtn.forEach((button, index) => {
            button.addEventListener("click", () => {
                this.openAdjustmentPanel(index);
            });
        });

        this.closeAdjustments.forEach((button, index) => {
            button.addEventListener("click", () => {
                this.closeAdjustmentPanel(index);
            });
        });

        this.lockBtn.forEach((button, index) => {
            button.addEventListener("click", () => {
                this.lockIcon(index);
            });
        });

        // Save to palette EVENT LISTENERS
        this.saveBtn.addEventListener("click", this.openPalette);

        this.closeSave.addEventListener("click", this.closePalette);

        this.submitSave.addEventListener("click", this.savePalette);

        // Library EVENT LISTENERS
        this.libraryBtn.addEventListener("click", this.openLibrary);

        this.closeLibraryBtn.addEventListener("click", this.closeLibrary);

        // Popup
        this.popup.addEventListener("transitionend", () => {
            const popupBox = this.popup.children[0];
            this.popup.classList.remove("active");
            popupBox.classList.remove("active");
        });
    }

    // Colour Generator
    // generateHex() {
    //     const letters = "0123456789ABCDEF";
    //     let hash = "#";
    //     for (let i = 0; i < 6; i++) {
    //         hash += letters[Math.floor(Math.random() * 16)];
    //     }
    //     return hash;
    // }

    generateHex() {
        const hexColour = chroma.random();
        return hexColour;
    }

    randomColours = () => {
        // Initial colours
        this.initialColours = [];

        this.colourDivs.forEach((div, index) => {
            const hexText = div.children[0];
            const randomColour = this.generateHex();

            // Add hex to array
            if (div.classList.contains("locked")) {
                this.initialColours.push(hexText.innerText);
                return;
            } else {
                this.initialColours.push(chroma(randomColour).hex());
            }

            // Add the colour to the background
            div.style.backgroundColor = randomColour;
            hexText.innerText = randomColour;

            // Check for contrast
            this.checkTextContrast(randomColour, hexText);

            // Initial Colourize Sliders
            const colour = chroma(randomColour);
            const sliders = div.querySelectorAll(".sliders input");
            const hue = sliders[0];
            const brightness = sliders[1];
            const saturation = sliders[2];

            this.colourizeSliders(colour, hue, brightness, saturation);
        });

        // Reset out inputs
        this.resetInputs();

        // Check for button contrast
        this.adjustBtn.forEach((button, index) => {
            this.checkTextContrast(this.initialColours[index], button);
            this.checkTextContrast(
                this.initialColours[index],
                this.lockBtn[index]
            );
        });
    };

    checkTextContrast(colour, text) {
        const luminance = chroma(colour).luminance();
        if (luminance > 0.5) {
            text.style.color = "black";
        } else {
            text.style.color = "white";
        }
    }

    colourizeSliders(colour, hue, brightness, saturation) {
        //Scale brightness
        const midBright = colour.set("hsl.l", 0.5);
        const scaleBright = chroma.scale(["black", midBright, "white"]);

        // Scale saturation
        const noSat = colour.set("hsl.s", 0);
        const fullSat = colour.set("hsl.s", 1);
        const scaleSat = chroma.scale([noSat, colour, fullSat]);

        // Update input colours

        hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75)`;

        brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
            0
        )}, ${scaleBright(0.5)}, ${scaleBright(1)})`;

        saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
            0
        )}, ${scaleSat(1)})`;
    }

    // Arrow function is used here to inherit the keyword this from the constructor
    hslControls = (e) => {
        const index =
            e.target.getAttribute("data-bright") ||
            e.target.getAttribute("data-sat") ||
            e.target.getAttribute("data-hue");

        let sliders = e.target.parentElement.querySelectorAll(
            'input[type="range"]'
        );
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        const bgColour = this.initialColours[index];

        let colour = chroma(bgColour)
            .set("hsl.s", saturation.value)
            .set("hsl.l", brightness.value)
            .set("hsl.h", hue.value);

        this.colourDivs[index].style.backgroundColor = colour;

        // Colourize inputs/sliders
        this.colourizeSliders(colour, hue, brightness, saturation);
    };

    updateTextUI(index) {
        const activeDiv = this.colourDivs[index];
        const colour = chroma(activeDiv.style.backgroundColor);
        const textHex = activeDiv.querySelector("h2");
        const icons = activeDiv.querySelectorAll(".controls button");

        textHex.innerText = colour.hex();

        // Check contrast
        this.checkTextContrast(colour, textHex);
    }

    resetInputs() {
        const sliders = document.querySelectorAll(".sliders input");

        sliders.forEach((slider) => {
            if (slider.name === "hue") {
                const hueColour = this.initialColours[
                    slider.getAttribute("data-hue")
                ];
                const hueValue = chroma(hueColour).hsl()[0];
                slider.value = Math.floor(hueValue);
            }

            if (slider.name === "brightness") {
                const brightColour = this.initialColours[
                    slider.getAttribute("data-bright")
                ];
                const brightValue = chroma(brightColour).hsl()[2];
                slider.value = Math.floor(brightValue * 100) / 100;
            }

            if (slider.name === "saturation") {
                const satColour = this.initialColours[
                    slider.getAttribute("data-sat")
                ];
                const satValue = chroma(satColour).hsl()[1];
                slider.value = Math.floor(satValue * 100) / 100;
            }
        });
    }

    copyToClipboard(hex) {
        const el = document.createElement("textarea");
        el.value = hex.innerText;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);

        // Pop up animation
        const popupBox = this.popup.children[0];
        this.popup.classList.add("active");
        popupBox.classList.add("active");
    }

    openAdjustmentPanel(index) {
        this.sliderContainers[index].classList.toggle("active");
    }

    closeAdjustmentPanel(index) {
        this.sliderContainers[index].classList.remove("active");
    }

    lockIcon(index) {
        this.colourDivs[index].classList.toggle("locked");
        this.lockBtn[index].children[0].classList.toggle("fa-lock-open");
        this.lockBtn[index].children[0].classList.toggle("fa-lock");
    }

    // Save to palette FUNCTIONS
    openPalette = (e) => {
        const popup = this.saveContainer.children[0];
        this.saveContainer.classList.add("active");
        popup.classList.add("active");
    };

    closePalette = (e) => {
        const popup = this.saveContainer.children[0];
        this.saveContainer.classList.remove("active");
        popup.classList.remove("active");
    };

    savePalette = (e) => {
        const popup = this.saveContainer.children[0];
        this.saveContainer.classList.remove("active");
        popup.classList.remove("active");

        const name = this.saveInput.value;
        const colours = [];

        this.currentHexes.forEach((hex) => {
            colours.push(hex.innerText);
        });

        // Generate object
        const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
        let paletteNr;

        if (paletteObjects) {
            paletteNr = paletteObjects.length;
        } else {
            paletteNr = this.savedPalettes.length;
        }

        const paletteObj = { name, colours, nr: paletteNr };
        this.savedPalettes.push(paletteObj);

        // Save to local storage
        this.saveToLocal(paletteObj);
        this.saveInput.value = "";

        this.generatePalette(paletteObj, this.savedPalettes);
    };

    generatePalette(paletteObj, palettes) {
        // Generate the palette for Library
        const palette = document.createElement("div");
        palette.classList.add("custom-palette");
        const title = document.createElement("h4");
        title.innerText = paletteObj.name;
        const preview = document.createElement("div");
        preview.classList.add("small-preview");
        paletteObj.colours.forEach((smallColour) => {
            const smallDiv = document.createElement("div");
            smallDiv.style.backgroundColor = smallColour;
            preview.appendChild(smallDiv);
        });
        const paletteBtn = document.createElement("button");
        paletteBtn.classList.add("pick-palette-btn");
        paletteBtn.classList.add(paletteObj.nr);
        paletteBtn.innerText = "Select";

        // Attach event to the button
        paletteBtn.addEventListener("click", (e) => {
            this.closeLibrary();
            const paletteIndex = e.target.classList[1];
            this.initialColours = [];
            palettes[paletteIndex].colours.forEach((colour, index) => {
                this.initialColours.push(colour);
                this.colourDivs[index].style.backgroundColor = colour;
                const text = this.colourDivs[index].children[0];
                this.checkTextContrast(colour, text);
                this.updateTextUI(index);
            });
            this.resetInputs();
        });

        // Append to Library
        palette.appendChild(title);
        palette.appendChild(preview);
        palette.appendChild(paletteBtn);
        this.libraryContainer.children[0].appendChild(palette);
    }

    saveToLocal(paletteObj) {
        let localPalettes;
        if (localStorage.getItem("palettes") === null) {
            localPalettes = [];
        } else {
            localPalettes = JSON.parse(localStorage.getItem("palettes"));
        }

        localPalettes.push(paletteObj);
        localStorage.setItem("palettes", JSON.stringify(localPalettes));
    }

    openLibrary = (e) => {
        const popup = this.libraryContainer.children[0];
        this.libraryContainer.classList.add("active");
        popup.classList.add("active");
    };

    closeLibrary = (e) => {
        const popup = this.libraryContainer.children[0];
        this.libraryContainer.classList.remove("active");
        popup.classList.remove("active");
    };

    getLocal() {
        if (localStorage.getItem("palettes") === null) {
            this.localPalettes = [];
        } else {
            const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
            this.savedPalettes = [...paletteObjects];

            paletteObjects.forEach((paletteObj) => {
                this.generatePalette(paletteObj, paletteObjects);
            });
        }
    }
}

const coloors = new Coloors();

coloors.getLocal();
coloors.randomColours();
