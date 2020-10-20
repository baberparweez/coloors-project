class Coloors {
    constructor() {
        // Globals selections and variables
        this.colourDivs = document.querySelectorAll(".colour");
        this.generateBtn = document.querySelector(".generate");
        this.sliders = document.querySelectorAll('input[type="range"]');
        this.currentHexes = document.querySelectorAll(".colour h2");
        this.initalColours;
    }

    // Colour Generator
    generateHex() {
        const letters = "0123456789ABCDEF";
        let hash = "#";
        for (let i = 0; i < 6; i++) {
            hash += letters[Math.floor(Math.random() * 16)];
        }
        return hash;
    }

    randomColours() {
        this.colourDivs.forEach((div, index) => {
            const hexText = div.children[0];
            const randomColour = this.generateHex();

            // Add the colour to the background
            div.style.backgroundColor = randomColour;

            console.log(randomColour);
        });
    }
}

const coloors = new Coloors();

let output = coloors.randomColours();
console.log(output);
