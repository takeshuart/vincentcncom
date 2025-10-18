export async function fetchQuotes(){
    try {
        const response = await fetch('/vangogh-quotes.json');

        if (!response.ok) {
            throw new Error('Failed to fetch quotes');
        }
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.length);
        const quote = data[randomIndex].content
        return quote;
    } catch (error) {
        console.error('Error fetching quotes:', error);
        throw error;
    }
};