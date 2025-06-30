var quotes = JSON.parse(localStorage.getItem("quotes"));
if (!quotes) {
  quotes = [
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
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

var quoteDisplay = document.getElementById("quoteDisplay");
var newQuoteBtn = document.getElementById("newQuote");
var categoryList = document.getElementById("categoryList");
var categoryFilter = document.getElementById("categoryFilter");

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  var selectedCategory = categoryFilter.value;
  var filteredQuotes = [];

  if (selectedCategory === "all") {
    filteredQuotes = quotes;
  } else {
    for (var i = 0; i < quotes.length; i++) {
      if (quotes[i].category === selectedCategory) {
        filteredQuotes.push(quotes[i]);
      }
    }
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found in this category.";
    return;
  }

  var index = Math.floor(Math.random() * filteredQuotes.length);
  var quote = filteredQuotes[index];

  quoteDisplay.innerHTML =
    '<blockquote>"' +
    quote.text +
    '"</blockquote>' +
    "<p><em>Category: " +
    quote.category +
    "</em></p>";

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote() {
  var textInput = document.getElementById("newQuoteText");
  var categoryInput = document.getElementById("newQuoteCategory");

  var text = textInput.value.trim();
  var category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Both quote text and category are required.");
    return;
  }

  var newQuote = { text: text, category: category };
  quotes.push(newQuote);
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  updateCategoryList();
  populateCategories();
  alert("Quote added!");
}

function populateCategories() {
  var categories = ["all"];
  for (var i = 0; i < quotes.length; i++) {
    if (categories.indexOf(quotes[i].category) === -1) {
      categories.push(quotes[i].category);
    }
  }

  var currentFilter = categoryFilter.value;

  categoryFilter.innerHTML = "";
  for (var j = 0; j < categories.length; j++) {
    var option = document.createElement("option");
    option.value = categories[j];
    option.textContent = categories[j];
    categoryFilter.appendChild(option);
  }

  var savedFilter = localStorage.getItem("selectedFilter");
  if (savedFilter && categories.includes(savedFilter)) {
    categoryFilter.value = savedFilter;
  } else {
    categoryFilter.value = currentFilter || "all";
  }
}

function updateCategoryList() {
  var categories = [];
  for (var i = 0; i < quotes.length; i++) {
    if (categories.indexOf(quotes[i].category) === -1) {
      categories.push(quotes[i].category);
    }
  }

  categoryList.innerHTML = "";

  for (var j = 0; j < categories.length; j++) {
    var li = document.createElement("li");
    li.textContent = categories[j];
    categoryList.appendChild(li);
  }
}

function filterQuotes() {
  var selected = categoryFilter.value;
  localStorage.setItem("selectedFilter", selected);
  showRandomQuote();
}

function exportToJsonFile() {
  var data = JSON.stringify(quotes);
  var blob = new Blob([data], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var importedQuotes = JSON.parse(e.target.result);
    for (var i = 0; i < importedQuotes.length; i++) {
      if (importedQuotes[i].text && importedQuotes[i].category) {
        quotes.push(importedQuotes[i]);
      }
    }
    saveQuotes();
    updateCategoryList();
    populateCategories();
    alert("Quotes imported!");
  };
  reader.readAsText(event.target.files[0]);
}

function loadLastViewedQuote() {
  var last = sessionStorage.getItem("lastQuote");
  if (last) {
    var quote = JSON.parse(last);
    quoteDisplay.innerHTML =
      '<blockquote>"' +
      quote.text +
      '"</blockquote>' +
      "<p><em>Category: " +
      quote.category +
      "</em></p>";
  } else {
    showRandomQuote();
  }
}

newQuoteBtn.addEventListener("click", showRandomQuote);
populateCategories();
updateCategoryList();
loadLastViewedQuote();

window.addQuote = addQuote;
window.exportToJsonFile = exportToJsonFile;
window.importFromJsonFile = importFromJsonFile;
window.filterQuotes = filterQuotes;
