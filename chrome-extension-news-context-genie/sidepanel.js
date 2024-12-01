async function chromeAIContextFinder(txtTextToContextualize) {
  if (!txtTextToContextualize) return;

  document.body.querySelector('#text-explanation').innerText = "Analyzing...";

  try {
    // Check for browser AI support
    const newsContextModel = await ai.languageModel.create({
      systemPrompt: "You are an expert at providing context, background information, and clarifications for news articles. Your job is to offer useful context for any news text or excerpt presented to you.",
    });

    const response = await newsContextModel.prompt("Provide relevant context, background, or clarifications for the following news article text:\n" + txtTextToContextualize);

    // Parse the markdown response and set the innerHTML
    const markdownContent = response.trim();
    document.body.querySelector('#text-explanation').innerHTML = marked(markdownContent); // Marked parses markdown into HTML
  } catch (error) {
    console.error('Context Finder error:', error);
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
