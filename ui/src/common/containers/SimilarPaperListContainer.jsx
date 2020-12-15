import { connect } from 'react-redux';

import { fetchLiteratureSimilarPapers } from '../../actions/literature';
import SimilarPaperList from '../../literature/components/SimilarPaperList';
import { convertSomeImmutablePropsToJS } from '../immutableToJS';

const stateToProps = state => ({
  loading: state.literature.get('loadingSimilarPapers'),
  similarPapers: state.literature.get('similarPapers'),
  error: state.literature.get('errorSimilarPapers'),
  total: state.literature.get('totalSimilarPapers'),
  query: state.literature.get('querySimilarPapers'),
});

const dispatchToProps = (dispatch, ownProps) => ({
  onQueryChange(query) {
    const { recordId } = ownProps;
    dispatch(fetchLiteratureSimilarPapers(recordId, query));
  },
});

export default connect(stateToProps, dispatchToProps)(
  convertSomeImmutablePropsToJS(SimilarPaperList, ['query'])
);
