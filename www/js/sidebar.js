/**
 * Open the sidebar.
 */
function openNav() {
    document.getElementById("mySidenav").style.width = "80%";
}

/**
 * Close the sidebar.
 */
function closeNav(url) {
    document.getElementById("mySidenav").style.width = "0";

    if (url !== '') {
        window.location = url;
    }
}