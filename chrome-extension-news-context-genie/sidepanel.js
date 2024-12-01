async function chromeAIContextFinder(txtTextToContextualize) {
    if (!txtTextToContextualize) return;
  
    document.body.querySelector('#text-explanation').innerText = "Analyzing text...";
  
    // Use await to wait for the fetch request to complete
    try {
        // Check for browser AI support

        const codeExplanationModel = await ai.languageModel.create({
          systemPrompt : "You are an expert at providing context, background information, and clarifications for news articles. Your job is to offer useful context for any news text or excerpt presented to you.",
        });
        const response = await codeExplanationModel.prompt("Provide relevant context, background, or clarifications for the following news article text:\n " + txtTextToContextualize);
        document.body.querySelector('#text-explanation').innerText = response.trim();
    } catch (error) {
        console.error('Text Explanation error:', error);
        document.body.querySelector('#text-explanation').innerText = 'Error analyzing text.';
    }
  }

chrome.storage.session.get('lastTextToContextualize', ({ lastTextToContextualize }) => {
    chromeAIContextFinder(lastTextToContextualize);
  });
  
chrome.storage.session.onChanged.addListener(async (changes) => {
    const lastTextToContextualizeChange = changes['lastTextToContextualize'];
  
    if (!lastTextToContextualizeChange) {
      return;
    }
  
    await chromeAIContextFinder(lastTextToContextualizeChange.newValue);

});
