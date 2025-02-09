(async function quoraUpvoter() {
    let upvotesDone = 0;
    const maxUpvotes = 100;

    const upvoteSelector = '.q-click-wrapper.puppeteer_test_votable_upvote_button';
    let upvotedPosts = new Set();

    // Floating Counter Popup
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
        <h4>Quora Auto Upvoter</h4>
        <p id="upvoteCount">Upvoted: 0</p>
        <p id="status">Status: Running...</p>
    `;
    document.body.appendChild(popup);

    function updatePopup() {
        document.getElementById('upvoteCount').innerText = `Upvoted: ${upvotesDone}`;
    }

    function updateStatus(text) {
        document.getElementById('status').innerText = `Status: ${text}`;
    }

    async function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clickUpvoteButtons() {
        let lastScrollHeight = 0;
        let scrollAttempts = 0;

        while (upvotesDone < maxUpvotes) {
            updateStatus("Looking for upvote buttons...");
            let buttons = Array.from(document.querySelectorAll(upvoteSelector))
                .filter(btn => !upvotedPosts.has(btn));

            if (buttons.length === 0) {
                scrollAttempts++;
                console.log(`🔄 No new buttons found. Scrolling attempt: ${scrollAttempts}`);

                if (scrollAttempts >= 5) {
                    updateStatus("Reloading page...");
                    console.log("🔄 Reloading page due to lack of new buttons...");
                    window.location.reload();
                    return;
                }

                window.scrollBy(0, 800);
                await waitFor(3000);
                continue;
            }

            scrollAttempts = 0; // Reset scroll attempts if new buttons found

            for (let btn of buttons) {
                if (upvotesDone >= maxUpvotes) break;

                upvotedPosts.add(btn);
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });

                await waitFor(500);
                btn.click();
                console.log(`✅ Upvoted post #${upvotesDone + 1}`);

                upvotesDone++;
                updatePopup();

                await waitFor(2000);
            }

            window.scrollBy(0, 800);
            await waitFor(3000);

            if (document.documentElement.scrollHeight === lastScrollHeight) {
                console.log("📌 Reached end of feed. Reloading...");
                updateStatus("Reloading page...");
                window.location.reload();
                return;
            }
            lastScrollHeight = document.documentElement.scrollHeight;
        }

        console.log("🎉 100 Upvotes Completed!");
        updateStatus("Done!");
    }

    console.log("🚀 Auto Upvoting Started...");
    await clickUpvoteButtons();
    console.log("✅ Script Completed!");
})();
