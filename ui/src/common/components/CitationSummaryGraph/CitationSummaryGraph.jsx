import React, { Component, Fragment } from 'react';
import {
  XAxis,
  YAxis,
  VerticalBarSeries,
  LabelSeries,
  FlexibleWidthXYPlot,
  DiscreteColorLegend,
} from 'react-vis';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import './CitationSummaryGraph.scss';
import 'react-vis/dist/style.css';
import maxBy from 'lodash.maxby';
import { ErrorPropType } from '../../propTypes';
import LoadingOrChildren from '../LoadingOrChildren';
import ErrorAlertOrChildren from '../ErrorAlertOrChildren';
import { CITEABLE_BAR_TYPE, PUBLISHED_BAR_TYPE } from '../../constants';
import styleVariables from '../../../styleVariables';
import { shallowEqual } from '../../utils';

const BAR_WIDTH = 0.5;
const GRAPH_MARGIN = { left: 40, right: 20, top: 10, bottom: 40 };
const GRAPH_HEIGHT = 250;

export const ORANGE = styleVariables['orange-6'];
export const HOVERED_ORANGE = styleVariables['orange-7'];
export const BLUE = styleVariables['primary-color'];
export const HOVERED_BLUE = styleVariables['blue-7'];
export const GRAY = styleVariables['gray-6'];

const LEGENDS = [
  { title: 'Citeable', color: BLUE },
  { title: 'Published', color: ORANGE },
];

const xValueToLabel = {
  '0--0': '0',
  '1--9': '1-9',
  '10--49': '10-49',
  '50--99': '50-99',
  '100--249': '100-249',
  '250--499': '250-499',
  '500--': '500+',
};

const typeToColors = {
  [CITEABLE_BAR_TYPE]: { color: BLUE, hoveredColor: HOVERED_BLUE },
  [PUBLISHED_BAR_TYPE]: { color: ORANGE, hoveredColor: HOVERED_ORANGE },
};

export const LABEL_OFFSET_RATIO_TO_GRAPH_WIDTH = 0.016;

class CitationSummaryGraph extends Component {
  constructor() {
    super();
    this.onBarMouseOut = this.onBarMouseOut.bind(this);
    this.onCiteableBarHover = this.onCiteableBarHover.bind(this);
    this.onPublishedBarHover = this.onPublishedBarHover.bind(this);
    this.onCiteableBarClick = this.onCiteableBarClick.bind(this);
    this.onPublishedBarClick = this.onPublishedBarClick.bind(this);
    this.updateGraphWidth = this.updateGraphWidth.bind(this);
    this.graphRef = React.createRef();
    this.state = {
      hoveredBar: null,
      graphWidth: 0,
    };
  }

  componentDidMount() {
    this.updateGraphWidth();
    window.addEventListener('resize', this.updateGraphWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateGraphWidth);
  }

  onCiteableBarClick(datapoint) {
    this.onBarClick({
      xValue: datapoint.x,
      type: CITEABLE_BAR_TYPE,
    });
  }

  onPublishedBarClick(datapoint) {
    this.onBarClick({
      xValue: datapoint.x,
      type: PUBLISHED_BAR_TYPE,
    });
  }

  onBarClick(clickedBar) {
    const { onSelectBarChange } = this.props;
    if (this.isSelectedBar(clickedBar)) {
      onSelectBarChange(null);
    } else {
      onSelectBarChange(clickedBar);
    }
  }

  onCiteableBarHover(datapoint) {
    this.onBarMouseHover({
      xValue: datapoint.x,
      type: CITEABLE_BAR_TYPE,
    });
  }

  onPublishedBarHover(datapoint) {
    this.onBarMouseHover({
      xValue: datapoint.x,
      type: PUBLISHED_BAR_TYPE,
    });
  }

  onBarMouseHover(hoveredBar) {
    this.setState({ hoveredBar });
  }

  onBarMouseOut() {
    this.setState({ hoveredBar: null });
  }

  getBarColor(bar) {
    const { selectedBar } = this.props;
    if (this.isHoveredBar(bar)) {
      return typeToColors[bar.type].hoveredColor;
    }
    if (!selectedBar || this.isSelectedBar(bar)) {
      return typeToColors[bar.type].color;
    }
    return GRAY;
  }

  updateGraphWidth() {
    const { graphWidth } = this.state;
    const currentWidth = this.graphRef.current.getBoundingClientRect().width;
    if (currentWidth !== graphWidth) {
      this.setState({ graphWidth: currentWidth });
    }
  }

  toSeriesData(bucket, type) {
    const { graphWidth } = this.state;
    const docCount = bucket.doc_count;
    const countLabel = docCount !== 0 ? docCount.toString() : null;
    const xOffset =
      type === CITEABLE_BAR_TYPE
        ? -LABEL_OFFSET_RATIO_TO_GRAPH_WIDTH * graphWidth
        : LABEL_OFFSET_RATIO_TO_GRAPH_WIDTH * graphWidth;
    return {
      x: bucket.key,
      y: docCount,
      label: countLabel,
      color: this.getBarColor({ xValue: bucket.key, type }),
      xOffset,
    };
  }

  isHoveredBar(bar) {
    const { hoveredBar } = this.state;
    return shallowEqual(bar, hoveredBar);
  }

  isSelectedBar(bar) {
    const { selectedBar } = this.props;
    return shallowEqual(bar, selectedBar);
  }

  render() {
    const { citeableData, publishedData, loading, error } = this.props;
    const publishedSeriesData = publishedData.map(b =>
      this.toSeriesData(b, PUBLISHED_BAR_TYPE)
    );
    const citeableSeriesData = citeableData.map(b =>
      this.toSeriesData(b, CITEABLE_BAR_TYPE)
    );

    const yDomainMax = Math.max(
      publishedSeriesData.length !== 0 && maxBy(publishedSeriesData, 'y').y,
      citeableSeriesData.length !== 0 && maxBy(citeableSeriesData, 'y').y
    );
    return (
      <div className="__CitationSummaryGraph__" ref={this.graphRef}>
        <Fragment>
          <LoadingOrChildren loading={loading}>
            <ErrorAlertOrChildren error={error}>
              <Row type="flex" align="middle">
                <Col span={24}>
                  <FlexibleWidthXYPlot
                    height={GRAPH_HEIGHT}
                    margin={GRAPH_MARGIN}
                    xType="ordinal"
                    yDomain={[0, yDomainMax * 1.4]}
                  >
                    <XAxis
                      className="x-axis"
                      title="Citations"
                      tickFormat={v => xValueToLabel[v]}
                    />
                    <YAxis title="Papers" />
                    <VerticalBarSeries
                      colorType="literal"
                      data={citeableSeriesData}
                      barWidth={BAR_WIDTH}
                      onValueMouseOver={this.onCiteableBarHover}
                      onValueClick={this.onCiteableBarClick}
                      onValueMouseOut={this.onBarMouseOut}
                      data-test-id="citeable-bar-series"
                      className="series-bar"
                    />
                    <LabelSeries
                      data={citeableSeriesData}
                      labelAnchorY="text-after-edge"
                      labelAnchorX="middle"
                    />
                    <VerticalBarSeries
                      colorType="literal"
                      data={publishedSeriesData}
                      barWidth={BAR_WIDTH}
                      onValueMouseOver={this.onPublishedBarHover}
                      onValueClick={this.onPublishedBarClick}
                      onValueMouseOut={this.onBarMouseOut}
                      data-test-id="published-bar-series"
                      className="series-bar"
                    />
                    <LabelSeries
                      data={publishedSeriesData}
                      labelAnchorY="text-after-edge"
                      labelAnchorX="middle"
                    />
                    <DiscreteColorLegend
                      className="legend"
                      items={LEGENDS}
                      orientation="horizontal"
                    />
                  </FlexibleWidthXYPlot>
                </Col>
              </Row>
            </ErrorAlertOrChildren>
          </LoadingOrChildren>
        </Fragment>
      </div>
    );
  }
}

CitationSummaryGraph.propTypes = {
  publishedData: PropTypes.arrayOf(PropTypes.any),
  citeableData: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.bool,
  error: ErrorPropType,
  onSelectBarChange: PropTypes.func.isRequired,
  selectedBar: PropTypes.shape({
    type: PropTypes.string.isRequired,
    xValue: PropTypes.string.isRequired,
  }),
};

CitationSummaryGraph.defaultProps = {
  publishedData: [],
  citeableData: [],
  loading: false,
  error: null,
  selectedBar: null,
};

export default CitationSummaryGraph;