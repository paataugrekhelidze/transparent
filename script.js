document.querySelectorAll(".collection-item").forEach((item) => {
  // listen to click event on the menu
  item.addEventListener("click", (e) => {
    let pageName;
    // figure out which menu option was clicked
    if (e.target.nodeName === "A") {
      pageName = e.target.text;
    } else if (e.target.nodeName === "LI") {
      pageName = e.target.firstElementChild.children[1].text;
    } else if (e.target.nodeName === "DIV") {
      pageName = e.target.children[1].text;
    } else {
      pageName = e.target.nextSibling.text;
    }

    // loop through all content and only display div that corresponds to a clicke page name
    Array.from(document.querySelector(".active-content").children).forEach(
      (item) => {
        if (item.id !== pageName) {
          item.style.display = "none";
        } else {
          item.style.display = "block";
        }
      }
    );
  });
});

const populateNews = async (brand) => {
  // fetch google search results
  let API_KEY = "AIzaSyCRPkErSNfWGpJ0O_TyoHHSWNVjuUItugs";
  let SEARCH_ENGINE = "b206e2519f1e09ec4";
  let link = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE}&q=${brand}+sustainability&num=5`;
  let data = await fetch(link, {
    headers: { Accept: "application/json" },
    method: "GET",
  });
  data = await data.json();

  // loop through li elements and insert a element pointing to api search results for sustainability(topic might change)
  Array.from(document.querySelector("#news-list").children).forEach(
    (item, index) => {
      let newlink = document.createElement("a");
      newlink.textContent = data["items"][index]["title"];
      newlink.setAttribute("href", data["items"][index]["link"]);
      newlink.setAttribute("target", "_blank");
      item.appendChild(newlink);
    }
  );
};

const wikiRate = async (link) => {
  let data = await fetch(link, {
    headers: { Accept: "application/json" },
    method: "GET",
  });
  data = await data.json();

  let score = Number.parseFloat(data.value).toFixed(1);
  // console.log(data);
  // console.log(score);
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

      // Create the chart
      Highcharts.chart("General", {
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
            shadow: false,
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
            ],
          },
        ],
        drilldown: {
          series: [
            {
              name: "overall",
              id: "overall",
              data: [
                {
                  name: "Policy & Commitments",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+1_Policy_Commitments_Score+" +
                      brand +
                      "+2020"
                  ),
                  drilldown: "Policy & Commitments",
                },
                {
                  name: "Governance",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+2_Governance_Score+" +
                      brand +
                      "+2020"
                  ),
                  drilldown: "Governance",
                },
                {
                  name: "Traceability",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+3_Traceability_Score+" +
                      brand +
                      "+2020"
                  ),
                  drilldown: "Traceability",
                },

                {
                  name: "Know,show & Fix",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+4_Know_Show_Fix_Score+" +
                      brand +
                      "+2020"
                  ),
                  drilldown: "Know,show & Fix",
                },
                {
                  name: "Spotlight Issues",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+5_Spotlight_Issues_Score+" +
                      brand +
                      "+2020"
                  ),
                  drilldown: "Spotlight Issues",
                },
              ],
            },
            {
              name: "Policy & Commitments",
              id: "Policy & Commitments",
              data: [
                {
                  name: "Own Operations Policies",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+1_1_Own_Operations_Policies+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Supply Chain Policies",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+1_2_Supply_Chain_Policies+" +
                      brand +
                      "+2020"
                  ),
                  drilldown: "Supply Chain Policies",
                },
                {
                  name: "Management Procedures",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+1_3_Management_Procedures+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Identification of Impacts",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+1_4_Identification_of_Impacts+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Strategic Plan for Improving Impacts",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+1_5_Strategic_Plan_for_Improving_Impacts+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Verified Sustainability Report",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+1_6_Verified_Sustainability_Report+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                },
              ],
            },
            {
              name: "Supply Chain Policies",
              id: "Supply Chain Policies",
              data: [
                {
                  name: "Supply Chain Policies in Local Language",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+Supply_Chain_Policies_in_Local_Language+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Supply Chain Policies Are Contractual",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+Supply_Chain_Policies_Are_Contractual+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Supply Chain Policies",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+Supply_Chain_Policies+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name:
                    "Supply Chain Policies Align with International Standards",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+Supply_Chain_Policies_Align_with_International_Standards+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                },
              ],
            },
            {
              name: "Governance",
              id: "Governance",
              data: [
                {
                  name:
                    "Identifies Lead Responsibility for Human Rights & Environmental Issues",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+2_1_Identifies_Lead_Responsibility_for_Human_Rights_Environmental_Issues+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name:
                    "Board Accountability for Human Rights & Environmental Issues",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+2_2_Board_Accountability_for_Human_Rights_Environmental_Issues+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name:
                    "Incorporation of Human Rights & Environmental Performance in Purchasing Practices",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+2_3_Incorporation_of_Human_Rights_Environmental_Performance_in_Purchasing_Practices+" +
                      brand +
                      "+2020"
                  ),
                },
              ],
            },
            {
              name: "Traceability",
              id: "Traceability",
              data: [
                {
                  name: "Tier One Factory Disclosure",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+3_1_Tier_One_Factory_Disclosure+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Processing Facilities Disclosure",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+3_2_Processing_Facilities_Disclosure+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Raw Materials Suppliers Disclosure",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+3_3_Raw_Materials_Suppliers_Disclosure+Fashion_Revolution_Research_Group+" +
                      brand +
                      "+2020"
                  ),
                },
              ],
            },
            {
              name: "Know,show & Fix",
              id: "Know,show & Fix",
              data: [
                {
                  name: "Know, Show & Fix: Due Diligence",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+4_1_Know_Show_Fix_Due_Diligence+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Know: Implementation of Supply Chain Policies",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+4_2_Know_Implementation_of_Supply_Chain_Policies+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Show: Facility Assessments",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+4_3_Show_Facility_Assessments+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Fix: Remediation",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+4_4_Fix_Remediation+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Fix: Grievance Management",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+4_5_Fix_Grievance_Management+" +
                      brand +
                      "+2020"
                  ),
                },
              ],
            },
            {
              name: "Spotlight Issues",
              id: "Spotlight Issues",
              data: [
                {
                  name: "Conditions",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+5_1_Conditions+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Consumption",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+5_2_Consumption+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Composition",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+5_3_Composition+" +
                      brand +
                      "+2020"
                  ),
                },
                {
                  name: "Climate",
                  y: await wikiRate(
                    "https://wikirate.org/Fashion_Revolution+5_4_Climate+" +
                      brand +
                      "+2020"
                  ),
                },
              ],
            },
          ],
        },
      });

      // build news list
      populateNews(brand);

      // turn off loader
      document.querySelector("#loader").style.display = "none";
      document.querySelector("#General").style.display = "block";
    }
  );
});
