const API_URL = "https://6862402e96f0cc4e34b8e95e.mockapi.io/api/v1/quotes";

let quotes = JSON.parse(localStorage.getItem("quotes"));
if (!quotes) {
  quotes = [
    {
      text: "The only limit to our realization of tomorrow is our doubts of today.",
      category: "Motivational",
      updatedAt: new Date().toISOString(),
    },
    {
      text: "In the middle of every difficulty lies opportunity.",
      category: "Inspirational",
      updatedAt: new Date().toISOString(),
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      category: "Life",
      updatedAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryList = document.getElementById("categoryList");
const categoryFilter = document.getElementById("categoryFilter");

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found in this category.";
    return;
  }

  const index = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[index];

  quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote>
     <p><em>Category: ${quote.category}</em></p>`;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Both quote text and category are required.");
    return;
  }

  const newQuote = {
    text: text,
    category: category,
    updatedAt: new Date().toISOString(),
  };

  quotes.push(newQuote);
  saveQuotes();

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newQuote),
  })
    .then((res) => res.json())
    .then(() => alert("Quote added and synced with server!"))
    .catch(() => alert("Quote added locally but failed to sync with server."));

  textInput.value = "";
  categoryInput.value = "";

  updateCategoryList();
  populateCategories();
}

function populateCategories() {
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];

  const savedFilter = localStorage.getItem("selectedFilter");
  categoryFilter.innerHTML = "";

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value =
    savedFilter && categories.includes(savedFilter) ? savedFilter : "all";
}

function updateCategoryList() {
  const categories = [...new Set(quotes.map((q) => q.category))];
  categoryList.innerHTML = "";
  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.textContent = cat;
    categoryList.appendChild(li);
  });
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedFilter", selected);
  showRandomQuote();
}

function exportToJsonFile() {
  const data = JSON.stringify(quotes);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    let hasNew = false;

    importedQuotes.forEach((imported) => {
      const existing = quotes.find((q) => q.text === imported.text);
      if (!existing) {
        quotes.push(imported);
        hasNew = true;
      }
    });

    if (hasNew) {
      saveQuotes();
      updateCategoryList();
      populateCategories();
      alert("Quotes imported!");
    } else {
      alert("No new quotes to import.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

function loadLastViewedQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote>
       <p><em>Category: ${quote.category}</em></p>`;
  } else {
    showRandomQuote();
  }
}

function fetchQuotesFromServer() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((serverQuotes) => {
      let hasChanges = false;

      for (let serverQuote of serverQuotes) {
        const localIndex = quotes.findIndex((q) => q.text === serverQuote.text);

        if (localIndex === -1) {
          quotes.push(serverQuote);
          hasChanges = true;
        } else {
          const localQuote = quotes[localIndex];
          if (
            new Date(serverQuote.updatedAt) > new Date(localQuote.updatedAt)
          ) {
            quotes[localIndex] = serverQuote;
            hasChanges = true;
          }
        }
      }

      if (hasChanges) {
        saveQuotes();
        updateCategoryList();
        populateCategories();
        alert("New quotes have been synced from the server.");
      }
    })
    .catch((err) => console.error("Failed to fetch from server:", err));
}

setInterval(fetchQuotesFromServer, 60000);

newQuoteBtn.addEventListener("click", showRandomQuote);
populateCategories();
updateCategoryList();
loadLastViewedQuote();
fetchQuotesFromServer();

window.addQuote = addQuote;
window.exportToJsonFile = exportToJsonFile;
window.importFromJsonFile = importFromJsonFile;
window.filterQuotes = filterQuotes;
