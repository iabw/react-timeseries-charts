/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import { TimeSeries } from "pondjs";

import ChartContainer from "../../../../../components/ChartContainer";
import ChartRow from "../../../../../components/ChartRow";
import Charts from "../../../../../components/Charts";
import YAxis from "../../../../../components/YAxis";
import LineChart from "../../../../../components/LineChart";
import Baseline from "../../../../../components/Baseline";
import Resizable from "../../../../../components/Resizable";

import baselines_docs from "./baselines_docs.md";
import baselines_thumbnail from "./baselines_thumbnail.png";

// Data
const data = require("./usd_vs_euro.json");
const points = data.widget[0].data.reverse();
const series = new TimeSeries({
    name: "USD_vs_EURO",
    columns: ["time", "value"],
    points
});

const style = {
    value: {
        stroke: "#a02c2c",
        opacity: 0.2
    }
};

const baselineStyle = {
    line: {
        stroke: "steelblue",
        strokeWidth: 1
    }
};

const baselineStyleLite = {
    line: {
        stroke: "steelblue",
        strokeWidth: 1,
        opacity: 0.5
    }
};

const baselines = React.createClass({
    getInitialState() {
        return {
            tracker: null,
            timerange: series.range()
        };
    },
    handleTrackerChanged(tracker) {
        this.setState({ tracker });
    },
    handleMouseMove(x, y) {
        this.setState({
            trackerVertical: {
                position: y,
                scale: "price",
                info: "Price: $" + this.refChartRow.scaleMap.price.sourceScale.invert(y).toFixed(4),
                style: {
                    strokeDasharray: "5,3",
                    stroke: "#ccc",
                    strokeWidth: 0.5,
                    fill: "none",
                    pointerEvents: "none"
                }
            }
        });
    },
    handleTimeRangeChange(timerange) {
        this.setState({ timerange });
    },
    render() {
        return (
            <Resizable>
                <ChartContainer
                    trackerPosition={this.state.tracker}
                    onTrackerChanged={t => this.handleTrackerChanged(t)}
                    onMouseMove={(x, y) => this.handleMouseMove(x, y)}
                    timeRange={series.range()}
                    format="%b '%y"
                >
                    <ChartRow
                        height="150"
                        ref={chartRow => {
                            this.refChartRow = chartRow;
                        }}
                        trackerVertical={this.state.trackerVertical}
                    >
                        <YAxis
                            id="price"
                            label="Price ($)"
                            min={series.min()}
                            max={series.max()}
                            width="60"
                            format="$,.2f"
                        />
                        <Charts>
                            <LineChart axis="price" series={series} style={style} />
                            <Baseline
                                axis="price"
                                style={baselineStyleLite}
                                value={series.max()}
                                label="Max"
                                position="right"
                            />
                            <Baseline
                                axis="price"
                                style={baselineStyleLite}
                                value={series.min()}
                                label="Min"
                                position="right"
                            />
                            <Baseline
                                axis="price"
                                style={baselineStyleLite}
                                value={series.avg() - series.stdev()}
                            />
                            <Baseline
                                axis="price"
                                style={baselineStyleLite}
                                value={series.avg() + series.stdev()}
                            />
                            <Baseline
                                axis="price"
                                style={baselineStyle}
                                value={series.avg()}
                                label="Avg"
                                position="right"
                            />
                        </Charts>
                    </ChartRow>
                </ChartContainer>
            </Resizable>
        );
    }
});

// Export example
export default { baselines, baselines_docs, baselines_thumbnail };
