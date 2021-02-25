const wikiRate = async (link) => {
  let data = await fetch(link, {
    headers: { Accept: "application/json" },
    method: "GET",
  });
  data = await data.json();

  let score = Number.parseFloat(data.value).toFixed(1);
  console.log(data);
  console.log(score);
  return parseFloat(score);
  // let src = document.getElementById(id);
  // src.textContent = score;
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

      /**
       * 
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
       */
      // await wikiRate(
      //   "https://wikirate.org/Fashion_Revolution%2BFashion_Transparency_Index_2020+" +
      //     brand +
      //     "+2020",
      //   "total"
      // );

      // console.log(overall);
      // console.log(typeof overall);

      // Create the chart
      Highcharts.chart("container", {
        chart: {
          type: "column",
        },
        title: {
          text: "Fashion Transparency Index",
        },
        subtitle: {
          text:
            'Click the link to view our resources. Source: <a href="https://issuu.com/fashionrevolution/docs/fr_fashiontransparencyindex2020?fr=sNmI5NzYxMDk0OA" target="_blank">Fashion Index</a>',
        },
        accessibility: {
          announceNewData: {
            enabled: true,
          },
        },
        xAxis: {
          type: "category",
        },
        // yAxis: {
        //   title: {
        //     text: "Index",
        //   },
        // },
        legend: {
          enabled: false,
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: "{point.y:.1f}",
            },
          },
        },

        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat:
            '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> of total<br/>',
        },

        series: [
          {
            name: "Score",
            colorByPoint: true,
            data: [
              {
                name: "Overall Index",
                y: await wikiRate(
                  "https://wikirate.org/Fashion_Revolution%2BFashion_Transparency_Index_2020+" +
                    brand +
                    "+2020"
                ),
                drilldown: "overall",
              },
              {
                name: "Firefox",
                y: 10.57,
                drilldown: "Firefox",
              },
              {
                name: "Internet Explorer",
                y: 7.23,
                drilldown: "Internet Explorer",
              },
            ],
          },
        ],
        drilldown: {
          series: [
            {
              name: "overall",
              id: "overall",
              data: [
                [
                  "Policy & Commitments",
                  await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+1_Policy_Commitments_Score+" +
                      brand +
                      "+2020"
                  ),
                ],
                [
                  "Governance",
                  await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+2_Governance_Score+" +
                      brand +
                      "+2020"
                  ),
                ],
                {
                  name: "Traceability",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+3_Traceability_Score+" +
                      brand +
                      "+2020"
                  ),
                  drilldown: "Traceability",
                },

                [
                  "Know,show & Fix",
                  await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+4_Know_Show_Fix_Score+" +
                      brand +
                      "+2020"
                  ),
                ],
                [
                  "Spotlight Issues",
                  await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+5_Spotlight_Issues_Score+" +
                      brand +
                      "+2020"
                  ),
                ],
              ],
            },
            {
              id: "Traceability",
              data: [
                [
                  "Tier One Factory Disclosure",
                  await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+3_1_Tier_One_Factory_Disclosure+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                ],
                [
                  "Processing Facilities Disclosure",
                  await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+3_2_Processing_Facilities_Disclosure+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                ],
                [
                  "Raw Materials Suppliers Disclosure",
                  await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+3_3_Raw_Materials_Suppliers_Disclosure+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                ],
              ],
            },
            {
              name: "Firefox",
              id: "Firefox",
              data: [
                ["v58.0", 1.02],
                ["v57.0", 7.36],
                ["v56.0", 0.35],
              ],
            },
            {
              name: "Internet Explorer",
              id: "Internet Explorer",
              data: [
                ["v11.0", 6.2],
                ["v10.0", 0.29],
                ["v9.0", 0.27],
                ["v8.0", 0.47],
              ],
            },
          ],
        },
      });

      //   var chart = new Highcharts.Chart({
      //     chart: {
      //         renderTo: 'container',
      //         type: 'pie'
      //     },
      //     series: [{
      //         data: myInitialDataArray, // make sure each data point has an id
      //         point: {
      //             events: {
      //                 click: function () {
      //                     $.post('/get/data/by/id/' + this.id, function(data) {
      //                         // you may need to format your data here
      //                         chart.series[0].setData(data);
      //                     });
      //                 }
      //             }
      //         }
      //     }]
      // });

      /**
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
       */
    }
  );
});
