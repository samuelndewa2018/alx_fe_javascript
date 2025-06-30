const quotes = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Motivational",
  },
  {
    text: "In the middle of every difficulty lies opportunity.",
    category: "Inspirational",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryList = document.getElementById("categoryList");

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Please add one!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <blockquote>"${text}"</blockquote>
    <p><em>Category: ${category}</em></p>
  `;
}

function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Both quote text and category are required.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);

  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  updateCategoryList();
  alert("New quote added successfully!");
}

function updateCategoryList() {
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))];

  categoryList.innerHTML = "";

  uniqueCategories.forEach((category) => {
    const li = document.createElement("li");
    li.textContent = category;
    categoryList.appendChild(li);
  });
}

newQuoteBtn.addEventListener("click", showRandomQuote);

showRandomQuote();
updateCategoryList();
