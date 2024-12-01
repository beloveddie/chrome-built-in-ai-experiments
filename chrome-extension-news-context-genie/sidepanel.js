function renderMarkdown(markdown) {
  // Basic Markdown Rules
  const rules = [
    { regex: /###### (.+)/g, replacement: '<h6>$1</h6>' }, // H6
    { regex: /##### (.+)/g, replacement: '<h5>$1</h5>' }, // H5
    { regex: /#### (.+)/g, replacement: '<h4>$1</h4>' }, // H4
    { regex: /### (.+)/g, replacement: '<h3>$1</h3>' }, // H3
    { regex: /## (.+)/g, replacement: '<h2>$1</h2>' }, // H2
    { regex: /# (.+)/g, replacement: '<h1>$1</h1>' },  // H1
    { regex: /\*\*(.+?)\*\*/g, replacement: '<b>$1</b>' }, // Bold
    { regex: /\*(.+?)\*/g, replacement: '<i>$1</i>' },    // Italics
    { regex: /- (.+)/g, replacement: '<li>$1</li>' },     // List Item
    { regex: /\n/g, replacement: '<br>' },               // Line Break
  ];

  // Apply Rules
  let html = markdown;
  rules.forEach(({ regex, replacement }) => {
    html = html.replace(regex, replacement);
  });

  // Wrap list items in <ul> tags
  html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

  return html;
}

async function chromeAIContextFinder(txtTextToContextualize) {
  if (!txtTextToContextualize) return;

  document.body.querySelector('#text-explanation').innerText = "Analyzing...";

  try {
    const newsContextModel = await ai.languageModel.create({
      systemPrompt: "You are an expert at providing context, background information, and clarifications for news articles. Your job is to offer useful context for any news text or excerpt presented to you.",
    });

    const response = await newsContextModel.prompt("Provide relevant context, background, or clarifications for the following news article text:\n" + txtTextToContextualize);

    // Render Markdown manually
    const markdownContent = response.trim();
    const htmlContent = renderMarkdown(markdownContent); // Convert markdown to HTML
    document.body.querySelector('#text-explanation').innerHTML = htmlContent;
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
