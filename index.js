/* 
 * Name: 주유민
 * Date: 2025-04-19
 * Section: IAB 6068
 * Description: 방명록 기능을 구현하여 사용자가 이름과 메시지를 입력하면 목록에 추가되고, 
 *              삭제 버튼으로 내역을 삭제할 수 있습니다. 
 *              또한 로컬스토리지에 저장하여 새로고침 후에도 기존 방명록 내역이 남도록 하였습니다.
 */

"use strict";


(function() {
    const STORAGE_KEY = "guestbookEntries";

    window.addEventListener("load", init);

    function init() {
        document.getElementById("guestbookForm").addEventListener("submit", handleFormSubmit);
        loadEntriesFromStorage();
    }

    // 방명록 제출
    function handleFormSubmit(event) {
        event.preventDefault();

        const nameInput = document.getElementById("guestName");
        const messageInput = document.getElementById("guestMessage");
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !message) {
            alert("이름과 메시지 입력을 완료해주세요.");
            return;
        }

        const entry = { name, message };
        addGuestEntry(entry);
        saveEntryToStorage(entry);

        nameInput.value = "";
        messageInput.value = "";
    }

    // 방명록 화면에 추가
    function addGuestEntry(entry) {
        const entryList = document.getElementById("entryList");
        const li = document.createElement("li");
        li.classList.add("entry");

        const span = document.createElement("span");
        span.textContent = `${entry.name}: ${entry.message}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "삭제";

        deleteBtn.addEventListener("click", function() {
            entryList.removeChild(li);
            deleteEntryFromStorage(entry);
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        entryList.appendChild(li);
    }

    // 로털스토리지에서 가져오기
    function loadEntriesFromStorage() {
        const data = localStorage.getItem(STORAGE_KEY);

        if (data) {
            const entries = JSON.parse(data);
            entries.forEach(entry => addGuestEntry(entry));
        }
    }

    // 로컬스토리지에 저장
    function saveEntryToStorage(entry) {
        const entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        entries.push(entry);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    // 로컬스토리지에서 삭제
    function deleteEntryFromStorage(entry) {
        let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        entries = entries.filter(e => e.name !== entry.name || e.message !== entry.message);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
})();
