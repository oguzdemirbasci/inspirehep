import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import ContentBox from '../../common/components/ContentBox';
import SimilarPaperItem from './SimilarPaperItem';
import ErrorAlertOrChildren from '../../common/components/ErrorAlertOrChildren';
import EmptyOrChildren from '../../common/components/EmptyOrChildren';
import { ErrorPropType } from '../../common/propTypes';
import ListWithPagination from '../../common/components/ListWithPagination';

function SimilarPaperList({
  total,
  similarPapers,
  error,
  loading,
  onQueryChange,
  query,
}) {
  const renderSimilarPaperItem = useCallback(
    (paper, index) => (
      // reference data model doesn't have any identifier, thus we have hack for `key`
      // FIXME: find an proper key for reference item as index might cause bugs
      <SimilarPaperItem
        key={paper.getIn(['titles', 0, 'title']) || String(index)}
        similarPaper={paper}
      />
    ),
    []
  );

  const onPageChange = useCallback(page => onQueryChange({ page }), [
    onQueryChange,
  ]);

  const onSizeChange = useCallback(
    (page, size) => onQueryChange({ size, page: '1' }),
    [onQueryChange]
  );

  const renderList = useCallback(
    () =>
      total > 0 && (
        <ListWithPagination
          renderItem={renderSimilarPaperItem}
          pageItems={similarPapers}
          onPageChange={onPageChange}
          onSizeChange={onSizeChange}
          total={total}
          page={query.page}
          pageSize={query.size}
        />
      ),
    [
      query.page,
      query.size,
      total,
      similarPapers,
      renderSimilarPaperItem,
      onPageChange,
      onSizeChange,
    ]
  );

  return (
    <ContentBox loading={loading}>
      <ErrorAlertOrChildren error={error}>
        <EmptyOrChildren data={similarPapers} title="0 Similar Paper">
          {renderList()}
        </EmptyOrChildren>
      </ErrorAlertOrChildren>
    </ContentBox>
  );
}
SimilarPaperList.propTypes = {
  total: PropTypes.number.isRequired,
  similarPapers: PropTypes.instanceOf(List).isRequired,
  error: ErrorPropType,
  loading: PropTypes.bool.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  query: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SimilarPaperList;
