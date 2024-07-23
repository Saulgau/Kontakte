let contacts = [];
let lastSearchTerm = '';
let currentContactIndex = -1;
let userProfile = {};

const friendlyEmojis = ['😊', '👋', '🌟', '🎉', '👍', '🙌', '🤗', '😃', '😄', '😁'];

function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function loadContacts() {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
        contacts = JSON.parse(savedContacts);
        displayContacts(contacts);
    }
}

function saveUserProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    updateAppTitle();
}

function loadUserProfile() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
        updateAppTitle();
        setRandomEmoji();
    }
}

function updateAppTitle() {
    const userNameSpan = document.getElementById('userName');
    userNameSpan.textContent = userProfile.name || '';
}

function setRandomEmoji() {
    if (userProfile.name) {
        const emojiSpan = document.getElementById('greetingEmoji');
        const randomEmoji = friendlyEmojis[Math.floor(Math.random() * friendlyEmojis.length)];
        emojiSpan.textContent = randomEmoji;
    }
}

function displayContacts(contactsToShow) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    contactsToShow.sort((a, b) => a.name.localeCompare(b.name)).forEach((contact, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="contact-name">${contact.name}</span>`;
        li.onclick = () => showContactDetails(index);
        contactList.appendChild(li);
    });
}

function searchContacts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    lastSearchTerm = searchTerm;
    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().startsWith(searchTerm) || 
        contact.name.toLowerCase().includes(' ' + searchTerm)
    );
    displayContacts(filteredContacts);
}

function showNewContactForm() {
    document.getElementById('mainView').classList.add('hidden');
    document.getElementById('newContactView').classList.remove('hidden');
}

function showMainView() {
    document.getElementById('mainView').classList.remove('hidden');
    document.getElementById('newContactView').classList.add('hidden');
    document.getElementById('contactDetailView').classList.add('hidden');
    document.getElementById('editContactView').classList.add('hidden');
    closeSideMenu();
    document.getElementById('searchInput').value = lastSearchTerm;
    searchContacts();
}

function showContactDetails(index) {
    currentContactIndex = index;
    const contact = contacts[index];
    const detailsDiv = document.getElementById('contactDetails');
    detailsDiv.innerHTML = `
        <h2>${contact.name}</h2>
        <a href="tel:${contact.phone}" class="contact-action">Anrufen: ${contact.phone}</a>
        <a href="mailto:${contact.email}" class="contact-action">E-Mail: ${contact.email}</a>
        ${contact.note ? `<p>Notiz: ${contact.note}</p>` : ''}
    `;
    document.getElementById('mainView').classList.add('hidden');
    document.getElementById('contactDetailView').classList.remove('hidden');
}

function editContact() {
    const contact = contacts[currentContactIndex];
    document.getElementById('editName').value = contact.name;
    document.getElementById('editPhone').value = contact.phone;
    document.getElementById('editEmail').value = contact.email;
    document.getElementById('editNote').value = contact.note;
    document.getElementById('contactDetailView').classList.add('hidden');
    document.getElementById('editContactView').classList.remove('hidden');
}

function deleteContact() {
    if (confirm('Möchten Sie diesen Kontakt wirklich löschen?')) {
        contacts.splice(currentContactIndex, 1);
        saveContacts();
        showMainView();
    }
}

function formatPhoneNumber(phone) {
    if (phone.startsWith('+49')) {
        return '0' + phone.slice(3);
    }
    return phone;
}

function toggleSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.toggle('open');
    if (sideMenu.classList.contains('open')) {
        document.getElementById('userNameInput').value = userProfile.name || '';
        document.getElementById('userPhone').value = userProfile.phone || '';
        document.getElementById('userEmail').value = userProfile.email || '';
    }
}

function closeSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.remove('open');
}

function resetUserProfile() {
    if (confirm('Möchten Sie Ihre persönlichen Daten wirklich zurücksetzen?')) {
        userProfile = {};
        saveUserProfile();
        document.getElementById('userProfileForm').reset();
        closeSideMenu();
        updateAppTitle();
        setRandomEmoji();
    }
}

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newContact = {
        name: document.getElementById('name').value,
        phone: formatPhoneNumber(document.getElementById('phone').value),
        email: document.getElementById('email').value,
        note: document.getElementById('note').value
    };
    contacts.push(newContact);
    saveContacts();
    this.reset();
    showMainView();
});

document.getElementById('editContactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    contacts[currentContactIndex] = {
        name: document.getElementById('editName').value,
        phone: formatPhoneNumber(document.getElementById('editPhone').value),
        email: document.getElementById('editEmail').value,
        note: document.getElementById('editNote').value
    };
    saveContacts();
    showContactDetails(currentContactIndex);
});

document.getElementById('userProfileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    userProfile = {
        name: document.getElementById('userNameInput').value,
        phone: formatPhoneNumber(document.getElementById('userPhone').value),
        email: document.getElementById('userEmail').value
    };
    saveUserProfile();
    closeSideMenu();
    setRandomEmoji();
});

document.getElementById('searchInput').addEventListener('input', searchContacts);

// Initialisierung
window.addEventListener('load', function() {
    loadContacts();
    loadUserProfile();
    setRandomEmoji();
});

// Event Listener für Klicks außerhalb des Seitenmenüs
document.addEventListener('click', function(event) {
    const sideMenu = document.getElementById('sideMenu');
    const menuBtn = document.querySelector('.menu-btn');
    if (!sideMenu.contains(event.target) && event.target !== menuBtn) {
        closeSideMenu();
    }
});