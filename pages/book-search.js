/*
 * Name: 주유민
 * Date: 2025-05-12
 * Section: IAB 6068
 * Description: 사용자가 작가 이름을 클릭하면 Open Library API를 통해
 *              해당 작가의 도서 목록과 표지 이미지를 출력합니다.
 */

"use strict";

(function () {
    window.addEventListener("load", initBookFeature);

    function initBookFeature() {
        const authors = document.querySelectorAll(".author");
        authors.forEach(author => {
            author.addEventListener("click", () => {
                const name = author.dataset.name; // 검색용
                const display = author.textContent.trim(); // html에 뜨는 이름
                showBooksByAuthor(name, display);
            });
        });
    }

    async function showBooksByAuthor(authorName, displayName) {
        const bookTitle = document.getElementById("book-title");
        const bookList = document.getElementById("book-list");
        if (!bookTitle || !bookList) return;

        bookTitle.textContent = `📘 ${displayName}의 작품`;
        bookList.innerHTML = "<li>불러오는 중...</li>";

        try {
            // 작가 키 검색하기
            const searchRes = await fetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)}`);
            const searchData = await searchRes.json();

            if (!searchData.docs || searchData.docs.length === 0 || !searchData.docs[0].key) {
                bookList.innerHTML = "<li>작가 정보를 찾을 수 없습니다.</li>";
                return;
            }

            const authorKey = searchData.docs[0].key; 
            const worksRes = await fetch(`https://openlibrary.org/authors/${authorKey}/works.json`);
            const worksData = await worksRes.json();
            const books = worksData.entries.slice(0, 10); // 최대 10권까지만 표시

            bookList.innerHTML = "";

            books.forEach(book => {
                const li = document.createElement("li");
                li.className = "book";
                li.style.display = "flex";
                li.style.alignItems = "center";
                li.style.marginBottom = "15px";

                // 책 표지
                const img = document.createElement("img");
                img.style.width = "50px";
                img.style.height = "75px";
                img.style.marginRight = "15px";

                // cover_id가 없을 때는 covers 배열 사용
                let coverId = book.cover_id || (book.covers && book.covers[0]);
                if (coverId) {
                    img.src = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
                } else {
                    img.src = "https://openlibrary.org/images/icons/avatar_book-sm.png";
                }

                // 책 제목
                const span = document.createElement("span");
                span.textContent = book.title;

                li.appendChild(img);
                li.appendChild(span);
                bookList.appendChild(li);
            });

        } catch (err) {
            bookList.innerHTML = "<li>오류가 발생했습니다.</li>";
            console.error("오류 발생:", err);
        }
    }
})();
