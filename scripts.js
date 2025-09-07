// init
let bookmarksData = null;
let currentBookmarksData = null; 
let bookmarksTable = document.getElementById("linkTable");
let bannerDiv = document.getElementById("bannerNoBookmarks");
let loadBookmarksButton = document.getElementById("load-config");
let inputBookmarks = document.getElementById('input');

// event listener
document.addEventListener("DOMContentLoaded", () => {
    const pageId = document.body.id;

    if (pageId === "index") {
        initPage();
    }
});
loadBookmarksButton.addEventListener("click", clickLoadButton);
inputBookmarks.addEventListener("change", loadBookmarks);

// 
function openSettings() {
    let settingsDiv = document.getElementsByClassName("settings")[0];

    if (settingsDiv) {
        if (settingsDiv.style.display === "flex") {
            settingsDiv.style.display = "none";
        } else {
            settingsDiv.style.display = 'flex';
        }
    }
};

function resetBookmarks() {    
    if (bookmarksData) {
        bookmarksTable.innerHTML = '';
        localStorage.removeItem("bookmarksData");
        bookmarksData = null;
        console.log("bookmarksData ripristinato.");
        initPage();
    } else {
        console.log("bookmarksData già a null");
    }
}

// load bookmarks if exists
function initPage() {
    bookmarksDataStr = localStorage.getItem("bookmarksData");
    console.log(bookmarksDataStr)

    if (!bookmarksDataStr) {
        bannerDiv.style.display = "block";
    } else {
        bookmarksData = JSON.parse(bookmarksDataStr);
        bannerDiv.style.display = "none";
        if (checkBookmarksFile()) {
            paginateBookmarks(bookmarksData);
        } else {
            window.alert("File di segnalibri in formato non valido.")
        }
    }
};

// Processo di caricamento
function clickLoadButton() {
    if (inputBookmarks) {
        inputBookmarks.click();
    }
};

function loadBookmarks() {
    let file = inputBookmarks.files[0];

    if (!file) {
        window.alert("Nessun file di segnalibri selezionato.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            const bookmarks = JSON.parse(content);
            localStorage.setItem("bookmarksData", JSON.stringify(bookmarks));
            bookmarksData = bookmarks;
            initPage()
        } catch(error) {
            window.alert("Errore durante il caricamento dei segnalibri.")
        }
    }
    reader.readAsText(file);

};

//
function checkBookmarksFile() {
    return true
};

// 
function paginateBookmarks(bk) {
    bookmarksTable.innerHTML = "";

    bk.items.forEach(sectionData => {
        let tr = document.createElement("tr");
        bookmarksTable.appendChild(tr);
        let td = document.createElement("td");
        tr.appendChild(td);

        let sectionDiv = document.createElement("div");
        sectionDiv.classList.add('bookmarks-section');
        td.appendChild(sectionDiv);

        let titleH3Div = document.createElement('div');
        titleH3Div.classList.add('title');
        sectionDiv.appendChild(titleH3Div);

        let titleH3 = document.createElement("h3");
        titleH3.textContent = sectionData.label;
        titleH3Div.appendChild(titleH3);

        let searchId = sectionData.id.concat('-', sectionData.label);

        if (sectionData['urls-list']) {
            let itemBox = document.createElement("div");
            itemBox.classList.add('item');
            sectionDiv.appendChild(itemBox);

            let urlList = document.createElement('ul')
            itemBox.appendChild(urlList);

            sectionData['urls-list'].forEach(urlElement => {
                searchId = searchId.concat('-', urlElement.label);

                let urlLi = document.createElement("li");
                urlList.appendChild(urlLi);

                let urlA = document.createElement('a');
                urlA.href = urlElement.url;
                urlA.textContent = urlElement.label;
                urlA.id = searchId;
                urlA.target = '_blank';
                urlLi.appendChild(urlA);
            })
        }

        if (sectionData['urls-nested']) {
            sectionData['urls-nested'].forEach(subsectionData => {
                searchId = searchId.concat('-', subsectionData.id, '-', subsectionData.label);

                let subSectionDiv = document.createElement('div');
                subSectionDiv.classList.add('bookmarks-subsection');
                sectionDiv.appendChild(subSectionDiv);

                let titleH4Div = document.createElement('div');
                titleH4Div.classList.add('title');
                subSectionDiv.appendChild(titleH4Div);

                let titleH4 = document.createElement('h4');
                titleH4.textContent = subsectionData.label;
                titleH4.classList.add('title');
                titleH4Div.appendChild(titleH4);

                let itemBox = document.createElement("div");
                itemBox.classList.add('item');
                subSectionDiv.appendChild(itemBox);

                let urlList = document.createElement('ul')
                itemBox.appendChild(urlList);

                subsectionData['urls'].forEach(urlsListValues => {
                    searchId = searchId.concat('-', urlsListValues.id, '-', urlsListValues.label);

                    let urlLi = document.createElement("li");
                    urlList.appendChild(urlLi);

                    let urlA = document.createElement('a');
                    urlA.href = urlsListValues.url;
                    urlA.textContent = urlsListValues.label;
                    urlA.id = searchId;
                    urlA.target = '_blank';
                    urlLi.appendChild(urlA);
                })
            })
        }
    });
};

function openDbConnection() {
    window.open('./db-connection.html', '_self');
};

function searchFunction() {
    let searchTextRaw = document.getElementById('searchText');
    let searchText = searchTextRaw.value.toLowerCase();
    let urlLink = document.querySelectorAll('#linkTable a');

    urlLink.forEach(linkRaw => {
        let link = linkRaw.id.toLowerCase();
        let linkLi = linkRaw.closest('li');

        if (link.includes(searchText)) {
            linkLi.style.display = '';
        } else {
            linkLi.style.display = 'none';
        }
    });

    const sections = document.querySelectorAll("#linkTable .bookmarks-section, #linkTable .bookmarks-subsection");
    sections.forEach(section => {
    const visibleLinks = section.querySelectorAll("li:not([style*='display: none'])");
    section.style.display = visibleLinks.length > 0 ? "" : "none";
  });

};

//