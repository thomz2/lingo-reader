
export async function getBackCardFromText(text, language) {
    const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                { 
                    role: "user",
                    content: `every message you receive, you translate to ${language}`
                },
                { 
                    role: "user", 
                    content: `quero que traduza o seguinte texto para ${language} e me retorne apenas a tradução: '${text}'`
                }
            ],
            store: false
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${API_KEY}` 
        },
    });
        // .then((response) => response.json())
        // .then((json) => console.log(json));

    const jsonRes = await response.json();

    if (!jsonRes.choices[0].message.content) return false;

    return jsonRes.choices[0].message.content;
}