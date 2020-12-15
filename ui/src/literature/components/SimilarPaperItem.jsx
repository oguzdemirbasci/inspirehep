import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { List, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import AuthorsAndCollaborations from '../../common/components/AuthorsAndCollaborations';
import ArxivEprintList from './ArxivEprintList';
import PublicationInfoList from '../../common/components/PublicationInfoList';
import DOIList from './DOIList';
import { LITERATURE } from '../../common/routes';
import LiteratureTitle from '../../common/components/LiteratureTitle';
import URLList from '../../common/components/URLList';
import {
  InlineUL,
  SEPARATOR_MIDDLEDOT,
} from '../../common/components/InlineList';

class SimilarPaperItem extends Component {
  static renderLabel(paper) {
    const label = paper.get('label');
    const labelDisplay = label ? <span>[{label}]</span> : null;
    return labelDisplay;
  }

  static renderTitle(paper) {
    const recordId = paper.get('control_number');
    const title = paper.getIn(['titles', 0]);
    if (recordId && title) {
      return (
        <Link className="f5" to={`${LITERATURE}/${recordId}`}>
          <LiteratureTitle title={title} />
        </Link>
      );
    }

    if (title) {
      return (
        <div className="f5">
          <LiteratureTitle title={title} />
        </div>
      );
    }

    return null;
  }

  static renderMisc(paper) {
    const misc = paper.get('misc');
    return misc && <div>{misc}</div>;
  }

  render() {
    const { similarPaper } = this.props;
    const publicationInfo = similarPaper.get('publication_info');
    const arxivEprint = similarPaper.get('arxiv_eprint');
    const dois = similarPaper.get('dois');
    const urls = similarPaper.get('urls');

    const authors = similarPaper.get('authors');
    const collaborations = similarPaper.get('collaborations');
    const collaborationsWithSuffix = similarPaper.get(
      'collaborations_with_suffix'
    );

    return (
      <List.Item>
        <Row
          gutter={24}
          type="flex"
          justify="start"
          align="middle"
          className="w-100 sm-plus-flex-nowrap"
        >
          <Col>
            <List.Item.Meta
              title={SimilarPaperItem.renderTitle(similarPaper)}
              description={
                <Fragment>
                  {SimilarPaperItem.renderMisc(similarPaper)}
                  <AuthorsAndCollaborations
                    authors={authors}
                    collaborations={collaborations}
                    collaborationsWithSuffix={collaborationsWithSuffix}
                  />
                  <InlineUL
                    separator={SEPARATOR_MIDDLEDOT}
                    wrapperClassName="secondary-container"
                  >
                    {publicationInfo && (
                      <PublicationInfoList
                        publicationInfo={publicationInfo}
                        labeled={false}
                      />
                    )}
                    {arxivEprint && <ArxivEprintList eprints={arxivEprint} />}
                    {dois && <DOIList dois={dois} />}
                    {urls && <URLList urls={urls} />}
                  </InlineUL>
                </Fragment>
              }
            />
          </Col>
        </Row>
      </List.Item>
    );
  }
}

SimilarPaperItem.propTypes = {
  similarPaper: PropTypes.instanceOf(Map).isRequired,
};

export default SimilarPaperItem;
