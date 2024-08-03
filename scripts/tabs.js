document.addEventListener("DOMContentLoaded", () => {
    const footerItems = document.querySelectorAll(".footer-item");
    const tabContents = document.querySelectorAll(".tab-content");

    const hideAllTabs = () => {
        tabContents.forEach(tab => tab.classList.remove("active")); // Hide all tabs
        footerItems.forEach(item => {
            item.classList.remove('active'); // Remove active class from footer items
            item.querySelector('.footer-icon').classList.remove('active'); // Remove active class from icons
        });
    };

    const showTab = (tabId) => {
        hideAllTabs();
        const selectedTab = document.getElementById(tabId);
        
        if (selectedTab) {
            selectedTab.classList.add("active");
            const activeFooterItem = Array.from(footerItems).find(item => item.getAttribute("data-tab") === tabId);
            if (activeFooterItem) {
                activeFooterItem.classList.add('active'); // Add active class to footer item
                activeFooterItem.querySelector('.footer-icon').classList.add('active'); // Add active class to icon
            }
        }
    };

    // Add click event listeners to footer items
    footerItems.forEach(item => {
        item.addEventListener("click", () => {
            const tabId = item.getAttribute("data-tab");
            showTab(tabId);
        });
    });

    // Initialize by showing the first tab
    hideAllTabs();
    showTab("tab3"); // Show the first tab by default
});
