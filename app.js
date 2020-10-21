class Coloors {
    constructor() {
        // Globals selections and variables
        this.colourDivs = document.querySelectorAll(".colour");
        this.generateBtn = document.querySelector(".generate");
        this.sliders = document.querySelectorAll('input[type="range"]');
        this.currentHexes = document.querySelectorAll(".colour h2");
        this.initialColours;

        this.sliders.forEach((slider) => {
            slider.addEventListener("input", this.hslControls);
        });

        this.colourDivs.forEach((slider, index) => {
            slider.addEventListener("change", () => {
                this.updateTextUI(index);
            });
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

    randomColours() {
        // Initial colours
        this.initialColours = [];

        this.colourDivs.forEach((div, index) => {
            const hexText = div.children[0];
            const randomColour = this.generateHex();

            // Add hex to array
            this.initialColours.push(chroma(randomColour).hex());

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
    }

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

    resetInputs = () => {
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
    };
}

const coloors = new Coloors();

let output = coloors.randomColours();
