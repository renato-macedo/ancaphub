import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography
} from '@material-ui/core';
import isEmpty from 'is-empty';
import Template from '../../components/template';
import Title from '../../components/template/titleComponent'
import BookCard from '../../components/collection/book/bookCard';
import ArticleCard from '../../components/collection/article/articleCard';
import VideoCard from '../../components/collection/video/videoCard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getSaved } from '../../actions/itemActions';
import LoadContent from '../../components/loaders/loadContent'

const SavedItems = props => {
  useEffect(() => props.getSaved(), []);

  return (
    <Template>
      <Title title="Itens Salvos" />
      <Box mb={3}>
        <Typography variant="h4" component="h2">
          Salvos
        </Typography>
      </Box>

      <LoadContent loading={false}>
      <Grid container spacing={2}>
        {props.saved && !isEmpty(props.saved) ? (
          props.saved.map(item => (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              {item.type === 'book' && <BookCard book={item} />}

              {item.type === 'article' && <ArticleCard article={item} />}

              {item.type === 'video' && <VideoCard video={item} />}
            </Grid>
          ))
        ) : (
            <Grid item xs={12}>
              <Paper>
                <Box p={2}>Você não possui nenhum item salvo.</Box>
              </Paper>
            </Grid>
          )}
      </Grid>
      </LoadContent>
    </Template>
  );
};

const mapStateToProps = state => ({ saved: state.auth.saved });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ getSaved }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SavedItems);
