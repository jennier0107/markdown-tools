document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a.third-party-link');
    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            chrome.tabs.create({url: event.target.href})
        })
    })
})