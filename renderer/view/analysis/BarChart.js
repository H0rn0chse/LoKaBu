import { DomElement } from "../common/DomElement.js";

const Chart = require("chart.js");

export class BarChart extends DomElement {
    constructor () {
        super("canvas");
        this.chart = new Chart(this.getNode(), {
            type: "line",
            data: {
                datasets: [
                    {
                        label: "Ernährung",
                        data: [
                            {
                                x: 1577836800000, // "01.01.2020",
                                y: 12
                            }, {
                                x: 1585785600000, // "02.04.2020",
                                y: 19
                            }, {
                                x: 1588464000000, // "03.05.2020",
                                y: 3
                            }, {
                                x: 1589241600000, // "12.05.2020",
                                y: 5
                            }, {
                                x: 1593993600000, // "06.07.2020",
                                y: -12
                            }, {
                                x: 1598745600000, // "30.08.2020",
                                y: 3
                            }
                        ],
                        backgroundColor: "lightgreen",
                        borderColor: "green"
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        type: "time",
                        time: {
                            tooltipFormat: "DD.MMM",
                            unit: "month"
                        },
                        ticks: {
                            callback: function (label, index, labels) {
                                const aMonth = label.match(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Nov|Dec/g);
                                if (!aMonth) {
                                    return label;
                                }
                                const sTranslation = this.translateMonth(aMonth[0]);
                                return label.replace(aMonth[0], sTranslation, "g");
                            }.bind(this)
                        }
                    }]
                },
                legend: {
                    position: "bottom"
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, data) => {
                            var iCount = parseFloat(tooltipItem.value, 10);
                            return `${iCount.toFixed(2)} €`;
                        }
                    }
                }
            }
        });
    }

    translateMonth (sMonth) {
        let sResult;
        switch (sMonth) {
            case "Jan":
                sResult = "Jan";
                break;
            case "Feb":
                sResult = "Feb";
                break;
            case "Mar":
                sResult = "Mar";
                break;
            case "Apr":
                sResult = "Apr";
                break;
            case "May":
                sResult = "Mai";
                break;
            case "Jun":
                sResult = "Jun";
                break;
            case "Jul":
                sResult = "Jul";
                break;
            case "Aug":
                sResult = "Aug";
                break;
            case "Sep":
                sResult = "Set";
                break;
            case "Oct":
                sResult = "Okt";
                break;
            case "Nov":
                sResult = "Nov";
                break;
            case "Dec":
                sResult = "Dez";
                break;
            default:
                sResult = sMonth;
        }

        return sResult;
    }
};
