
const searchSource = `
Some text
https://leetcode.com/u/divyadarshan
leetcode.com/hariish_s
`;

const leetcodeMatch = searchSource.match(/(?:leetcode\.com\/(?:u\/)?)([\w\-\_]+)/i);
console.log("Match:", leetcodeMatch);

if (leetcodeMatch && leetcodeMatch[1]) {
    const username = leetcodeMatch[1].replace(/\/$/, "");
    console.log("Username:", username);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        console.log(`Fetching stats for ${username}...`);
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        console.log("Response Status:", response.status);
        if (response.ok) {
            const data = await response.json();
            console.log("Data:", data);
        } else {
            console.log("Response not OK");
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
