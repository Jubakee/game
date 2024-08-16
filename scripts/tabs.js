document.addEventListener("DOMContentLoaded", () => {
    const footerItems = document.querySelectorAll(".footer-item");
    const tabContents = document.querySelectorAll(".tab-content");

    // Hide all tabs and remove active classes from footer items
    const hideAllTabs = () => {
        tabContents.forEach(tab => tab.classList.remove("active"));
        footerItems.forEach(item => {
            item.classList.remove('active');
            item.querySelector('.footer-icon').classList.remove('active');
        });
    };

    // Show the selected tab based on its ID
    const showTab = (tabId) => {
        hideAllTabs();
        const selectedTab = document.getElementById(tabId);
        
        if (selectedTab) {
            selectedTab.classList.add("active");

            const activeFooterItem = Array.from(footerItems).find(item => item.getAttribute("data-tab") === tabId);
            if (activeFooterItem) {
                activeFooterItem.classList.add('active');
                activeFooterItem.querySelector('.footer-icon').classList.add('active');
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
    showTab("tab1"); // Show the default tab
});
