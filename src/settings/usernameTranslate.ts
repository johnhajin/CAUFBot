import fs from 'fs';
import path from 'path';

let usernameMapping: { [key: string]: string } = {};

const loadMappingsFromFile = (filePath: string): void => {
    usernameMapping = {};
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');
    lines.forEach((line) => {
        const [telegramUsername, discordUsername] = line.split(':');
        if (telegramUsername && discordUsername) {
            usernameMapping[telegramUsername.trim()] = discordUsername.trim();
        }
    });
};

const translateUsername = (username: unknown, platform: "telegram" | "discord"): string => {
    const mappingsFilePath = path.resolve(__dirname, '../../src/settings/usernameMappings.txt');
    loadMappingsFromFile(mappingsFilePath);
    if (typeof username !== "string") {
        return ""; // Handle the case where username is not a string
    }
    if (platform === "telegram") {
        return usernameMapping[username] || username + " (Warning was unable to translate)"; // Translate if a mapping exists
    } else if (platform === "discord") {
        // If translating from Discord to Telegram, you would need a reverse mapping or a different strategy
        const invertedMapping: { [value: string]: string } = Object.fromEntries(
            Object.entries(usernameMapping).map(([key, value]) => [value, key])
        );

        return invertedMapping[username] || username + " (Warning was unable to translate)";
    }
    return username;
};

const getId = (username: unknown): string => {
    const mappingsFilePath = path.resolve(__dirname, '../../src/settings/discordIdMappings.txt');
    loadMappingsFromFile(mappingsFilePath);
    if (typeof username !== "string") {
        return ""; // Handle the case where username is not a string
    }
    
    return usernameMapping[username] || username + " (Warning was unable to translate)"; // Translate if a mapping exists
};

export { translateUsername, loadMappingsFromFile,usernameMapping,getId};
