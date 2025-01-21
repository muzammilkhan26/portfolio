// Social Media Link to Icon Mapping
const socialMediaIcons = {
    'linkedin': 'fab fa-linkedin',
    'tryhackme': 'fab fa-tryhackme',
    'facebook': 'fab fa-facebook',
    'instagram': 'fab fa-instagram',
    'twitter': 'fab fa-twitter'
};

// Function to add social media icons dynamically
function addSocialMediaIcons() {
    const links = document.querySelectorAll('.social-icon'); // Get all links
    links.forEach(link => {
        const url = link.href.toLowerCase(); // Get the href of each link
        let iconClass = ''; // Variable to store the icon class

        // Check if the link contains the platform's name and assign corresponding icon
        if (url.includes('linkedin')) {
            iconClass = socialMediaIcons['linkedin'];
        } else if (url.includes('tryhackme')) {
            iconClass = socialMediaIcons['tryhackme'];
        } else if (url.includes('facebook')) {
            iconClass = socialMediaIcons['facebook'];
        } else if (url.includes('instagram')) {
            iconClass = socialMediaIcons['instagram'];
        } else if (url.includes('twitter')) {
            iconClass = socialMediaIcons['twitter'];
        }

        // Add the icon class to the link if an icon is found
        if (iconClass) {
            const iconElement = document.createElement('i'); // Create the <i> element
            iconElement.className = iconClass; // Set the icon class
            link.innerHTML = ''; // Clear the link content
            link.appendChild(iconElement); // Add the icon to the link
        }
    });
}

// Call the function after the DOM is loaded
window.onload = addSocialMediaIcons;
