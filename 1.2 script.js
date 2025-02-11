(async function autoPin() {
    const pinButtonSelector = '.INd.V92.ebZ.pXK.zI7.iyn.Hsu';
    let totalPinned = 0;
    const maxPins = 50; // Change this to set how many pins to save

    while (totalPinned < maxPins) {
        let buttons = Array.from(document.querySelectorAll(pinButtonSelector));

        if (buttons.length === 0) {
            console.log("🔄 No more 'Pin' buttons found, scrolling...");
            window.scrollBy(0, 1000); // Scroll down to load more content
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for new content to load
            continue;
        }

        for (let i = 0; i < buttons.length && totalPinned < maxPins; i++) {
            let button = buttons[i];

            // Scroll to the button and click it
            button.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(resolve => setTimeout(resolve, 500));
            button.click();
            console.log(`📌 Pinned ${totalPinned + 1}`);

            totalPinned++;

            // Wait for the Pin to be processed before continuing
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        // Scroll to load more pins
        window.scrollBy(0, 1000);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`✅ Successfully pinned ${totalPinned} items!`);

})();
