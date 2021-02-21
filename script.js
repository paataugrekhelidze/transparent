const wikiRate = async (link, id) => {
  let data = await fetch(link, {
    headers: { Accept: "application/json" },
    method: "GET",
  });
  data = await data.json();

  let score = Number.parseFloat(data.value).toFixed(0);
  console.log(score);
  let src = document.getElementById(id);
  src.textContent = score;
};

document.addEventListener("DOMContentLoaded", async function () {
  // load brand logo
  chrome.tabs.query(
    {
      //This method output active URL
      active: true,
      currentWindow: true,
      status: "complete",
      windowType: "normal",
    },
    async function (tabs) {
      let hostname;
      for (tab in tabs) {
        hostname = tabs[tab].url;
      }
      let brand;
      if (hostname.split(".").length === 1) {
        brand = hostname.split("//")[1];
      } else if (hostname.split(".").length === 2) {
        brand = hostname.split(".")[0].split("//")[1];
      } else {
        brand = hostname.split(".")[1];
      }
      console.log(hostname);
      console.log(brand);
      // create a logo image and insert inside html
      let img = document.createElement("img");
      img.src = "https://logo.clearbit.com/" + brand + ".com?size=150";
      img.classList.add("brand-logo");

      let src = document.getElementById("logo-container");
      src.appendChild(img);

      // get and insert wikiRate score data
      // insert total
      await wikiRate(
        "https://wikirate.org/Fashion_Revolution%2BFashion_Transparency_Index_2020+" +
          brand +
          "+2020",
        "total"
      );

      // insert policy/commitment score
      await wikiRate(
        "https://wikirate.org/Fashion_Revolution+1_Policy_Commitments_Score+" +
          brand +
          "+2020",
        "commitment"
      );

      // insert governance score
      await wikiRate(
        "https://wikirate.org/Fashion_Revolution+2_Governance_Score+" +
          brand +
          "+2020",
        "governance"
      );

      // insert traceability score
      await wikiRate(
        "https://wikirate.org/Fashion_Revolution+3_Traceability_Score+" +
          brand +
          "+2020",
        "traceability"
      );

      // insert ksf score
      await wikiRate(
        "https://wikirate.org/Fashion_Revolution+4_Know_Show_Fix_Score+" +
          brand +
          "+2020",
        "ksf"
      );

      // insert spotlight score
      await wikiRate(
        "https://wikirate.org/Fashion_Revolution+5_Spotlight_Issues_Score+" +
          brand +
          "+2020",
        "spotlight"
      );

      // load up score circle
      // Find all rating items
      const ratings = document.querySelectorAll(".rating");

      // Iterate over all rating items
      ratings.forEach((rating) => {
        // Get content and get score as an int
        const ratingContent = rating.innerHTML;
        const ratingScore = parseInt(ratingContent, 10);

        // Define if the score is good, meh or bad according to its value
        const scoreClass =
          ratingScore < 4 ? "bad" : ratingScore < 6 ? "meh" : "good";

        // Add score class to the rating
        rating.classList.add(scoreClass);

        // After adding the class, get its color
        const ratingColor = window.getComputedStyle(rating).backgroundColor;

        // Define the background gradient according to the score and color
        const gradient = `background: conic-gradient(${ratingColor} ${
          ratingScore * 10
        }%, transparent 0 100%)`;

        // Set the gradient as the rating background
        rating.setAttribute("style", gradient);

        // Wrap the content in a tag to show it above the pseudo element that masks the bar
        rating.innerHTML = `<span>${ratingScore}</span>`;
      });
    }
  );
});
