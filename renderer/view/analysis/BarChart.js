import { getColor } from "../../common/ColorUtils.js";
import { deepClone } from "../../common/Utils.js";
import { translateMonth } from "../../common/DateUtils.js";
import { DomElement } from "../common/DomElement.js";

const Chart = require("chart.js");

export class BarChart extends DomElement {
    constructor () {
        super("canvas");

        this.chart = new Chart(this.getNode(), {
            type: "line",
            data: {
                datasets: []
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
                                const aMonth = label.match(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/g);
                                if (!aMonth) {
                                    return label;
                                }
                                const sTranslation = translateMonth(aMonth[0]);
                                return label.replace(aMonth[0], sTranslation, "g");
                            }
                        }
                    }]
                },
                legend: {
                    position: "bottom"
                },
                tooltips: {
                    displayColors: false,
                    callbacks: {
                        title: (tooltipItems, data) => {
                            const oDataset = data.datasets[tooltipItems[0].datasetIndex];
                            const dDate = new Date(oDataset.data[tooltipItems[0].index].x);
                            return `${oDataset.label} ${dDate.getFullYear()}-${dDate.getMonth().toString().padStart(2, "0")}:`;
                        },
                        label: (tooltipItem, data) => {
                            var iCount = parseFloat(tooltipItem.value, 10);
                            return `${iCount.toFixed(2)} €`;
                        }
                    }
                }
            }
        });
    }

    _applyCategoricalColor (aData = []) {
        return aData.map((oItem, iIndex) => {
            iIndex = (iIndex % 14) + 1;
            oItem.borderColor = getColor(`--chart-cat${iIndex}-light`);
            oItem.backgroundColor = 'rgba(255, 255, 255, 0)';
            return oItem;
        });
    }

    setData (aData = []) {
        const aNewData = this._applyCategoricalColor(deepClone(aData));

        this.chart.data.datasets = aNewData;
        this.chart.update();

        return this;
    }
};
