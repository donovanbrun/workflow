import axios from "axios";
import { log } from "../utils/log";
import * as mongodb from "../utils/mongodb";

export async function process() {
    try {
        const characters = await extract("https://raw.githubusercontent.com/optc-db/optc-db.github.io/master/common/data/units.js");
        const transformedCharacters = transform(characters);
        await load(transformedCharacters);
        log("INFO", "one-piece-treasure-cruise done");
    }
    catch (e: any) {
        log("ERROR", "one-piece-treasure-cruise failed");
        log("ERROR", e);
    }
}

async function extract(url: string): Promise<any[]> {
    const data: string = await axios.get(url).then((res) => res.data).catch((e) => {
        console.log(e);
    })

    let startIndex = data.indexOf("window.units = [") + 15;
    let endIndex = data.indexOf("var calcGhostStartID");

    let res = data.slice(startIndex, endIndex);

    res = res.replace(/'(6\+|5\+)'/g, '"$1"');

    let lastCommaIndex = res.lastIndexOf(',');
    if (lastCommaIndex !== -1) {
        res = res.slice(0, lastCommaIndex) + res.slice(lastCommaIndex + 1);
    }

    let lastDelimiterIndex = res.lastIndexOf(';');
    if (lastDelimiterIndex !== -1) {
        res = res.slice(0, lastDelimiterIndex) + res.slice(lastDelimiterIndex + 1);
    }

    return JSON.parse(res);
}

function transform(characters: any[]): any[] {

    function idToLink(id: number) {
        const idStr = String(id).padStart(4, '0');
        const firstSegment = Math.floor(id / 1000);
        const secondSegment = (Math.floor(Math.floor(id % 1000) / 100) * 100).toString().padStart(3, '0');

        return `/${firstSegment}/${secondSegment}/${idStr}.png`;
    }

    let res: any[] = [];
    characters.forEach((character, i) => {
        res.push({
            id: i + 1,
            name: character[0],
            rank: character[3],
            img: "https://raw.githubusercontent.com/optc-db/optc-db.github.io/master/api/images/full/transparent" + idToLink(i + 1),
        })
    });

    log("INFO", `Transformed ${res.length} characters`);
    res = res.filter((character) => character.name);
    log("INFO", `Filtered ${res.length} characters`);

    return res;
}

async function load(characters: any[]) {
    if (characters.length === 0) {
        throw new Error("No characters to load");
    }

    const fs = require('fs');
    fs.writeFileSync('data/characters.json', JSON.stringify(characters), 'utf-8');

    await mongodb.clearCollection('optc', 'characters');
    return await mongodb.insertMany(characters, 'optc', 'characters');
}