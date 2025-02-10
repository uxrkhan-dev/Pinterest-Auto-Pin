(async function automatePinning() {
    let pinnedPosts = new Set(); // Track already pinned posts
    let totalPinned = 0;
    const maxPins = 50;

    const postContainerSelector = 'div.S9z.eEj.iyn.oCZ.Tbt.L4E.e8F.BG7';  // Clickable posts
    const doneButtonSelector = '.RCK.Hsu.USg.adn.NTm.KhY.iyn.oRi.lnZ.wsz';  // "Done" button

    // Floating Popup to Track Progress
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.right = '20px';
    popup.style.padding = '10px';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.color = 'white';
    popup.style.borderRadius = '5px';
    popup.style.fontSize = '14px';
    popup.style.zIndex = '10000';
    popup.innerHTML = `
        <h4>Auto Pinner</h4>
        <p id="pinCount">Pinned: 0</p>
        <p id="status">Status: Running...</p>
    `;
    document.body.appendChild(popup);

    function updatePopup() {
        document.getElementById('pinCount').innerText = `Pinned: ${totalPinned}`;
    }

    function updateStatus(text) {
        document.getElementById('status').innerText = `Status: ${text}`;
    }

    async function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clickElement(element, description, delay = 1000) {
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Scroll to the element
            await waitFor(500);
            element.click();
            console.log(`✅ Clicked: ${description}`);
            await waitFor(delay);
            return true;
        }
        return false;
    }

    async function pinPosts() {
        let lastScrollHeight = 0;
        let scrollAttempts = 0;

        while (totalPinned < maxPins) {
            updateStatus("Looking for posts to pin...");
            let posts = Array.from(document.querySelectorAll(postContainerSelector)).filter(post => !pinnedPosts.has(post));

            if (posts.length === 0) {
                scrollAttempts++;
                console.log(`🔄 No new posts found. Scrolling attempt: ${scrollAttempts}`);

                if (scrollAttempts >= 5) {  
                    updateStatus("Reloading page...");
                    console.log("🔄 Reloading page due to lack of new posts...");
                    window.location.reload();
                    return;
                }

                window.scrollBy(0, 1000);
                await waitFor(3000);
                continue;
            }

            scrollAttempts = 0; // Reset scroll attempts if new posts are found

            for (let post of posts) {
                if (totalPinned >= maxPins) break;

                pinnedPosts.add(post); // Mark as processed
                await clickElement(post, "Pin post", 2000);
                totalPinned++;
                updatePopup();

                await waitFor(2000);
            }

            window.scrollBy(0, 1000);
            await waitFor(3000);

            if (document.documentElement.scrollHeight === lastScrollHeight) {
                console.log("📌 Reached end of feed. Reloading...");
                updateStatus("Reloading page...");
                window.location.reload();
                return;
            }
            lastScrollHeight = document.documentElement.scrollHeight;
        }

        console.log("🎉 50 Pins Completed!");
        updateStatus("Clicking Done...");
        let doneButton = document.querySelector(doneButtonSelector);
        if (doneButton) {
            await clickElement(doneButton, "Done button", 2000);
        } else {
            console.log("❌ Done button not found!");
        }
    }

    console.log("🚀 Auto Pinning Started...");
    await pinPosts();
    console.log("✅ Script Completed!");
})();
