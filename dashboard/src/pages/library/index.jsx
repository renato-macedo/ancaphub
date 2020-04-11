import React, { useEffect, useState } from 'react';
import  {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Menu,
  MenuItem,
  Input,
  Tabs,
  Tab,
  InputAdornment,
  InputLabel,
  FormControl,
  Select,
} from '@material-ui/core';
import {
  Description as ArticleIcon,
  PlayArrow as VideoIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Book as BookIcon
} from '@material-ui/icons'
import Hero from '../../components/template/hero';
import TitleComponent from '../../components/template/titleComponent';
import Published from './published'
import Pending from './pending'
import Trash from './trash'
import Draft from './draft'
import isEmpty from 'is-empty';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAllItems, deleteItem, approveItem } from '../../actions/collectionActions';
import { fetchAllCategories } from '../../actions/categoryActions';

function Books(props) {
  const { items, total } = props.items;
  const [clientCurrentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState({ type: '', category: '' });
  const [status, changeStatus] = useState('published');
  const [search, handleSearch] = useState('');

  useEffect(() => props.fetchAllCategories(), []);
  useEffect(() => props.fetchAllItems(clientCurrentPage, filter, status), [
    clientCurrentPage,
    filter,
    status
  ]);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleChange(event) {
    setFilter(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
  }

  return (
    <>
      <TitleComponent title="Coleção" />
      <Hero title="Coleção">
        <Button
          variant="outlined"
          color="primary"
          aria-controls="add-item-options"
          aria-haspopup="true"
          onClick={handleClick}>
          <AddIcon style={{ marginRight: '5px' }} />
          Item
        </Button>
        <Menu
          id="add-item-options"
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}>
          <MenuItem component={Link} to="/collection/book/add">
            Livro
          </MenuItem>
          <MenuItem component={Link} to="/collection/article/add">
            Artigo
          </MenuItem>
          <MenuItem component={Link} to="/collection/video/add">
            Vídeo
          </MenuItem>
          <MenuItem onClick={handleClose}>Podcast</MenuItem>
        </Menu>
      </Hero>
      <Container>
        <Box my={3}>
          <Paper>
            <Box p={2}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <FormControl style={{ width: '100%' }}>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      value={filter.type}
                      onChange={handleChange}
                      inputProps={{
                        name: 'type'
                      }}>
                      <MenuItem value="">Tudo</MenuItem>
                      <MenuItem value="article">Artigo</MenuItem>
                      <MenuItem value="book">Livro</MenuItem>
                      <MenuItem value="podcast">Podcast</MenuItem>
                      <MenuItem value="video">Vídeo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl style={{ width: '100%' }}>
                    <InputLabel>Categoria</InputLabel>
                    <Select
                      value={filter.category}
                      onChange={handleChange}
                      inputProps={{
                        name: 'category'
                      }}>
                      <MenuItem value="" key="no-category">
                        Todos
                      </MenuItem>
                      {props.categories.allCategories.map(category => (
                        <MenuItem
                          value={category._id}
                          key={`category-${category._id}`}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}></Grid>
                <Grid item xs={3}>
                  <FormControl>
                    <InputLabel htmlFor="search-item">Buscar</InputLabel>
                    <Input
                      id="search-item"
                      value={search}
                      onChange={e => handleSearch(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>

        <Box my={3}>
          <Paper>
            <Tabs value={status} onChange={(e, value) => changeStatus(value)}>
              <Tab label="Publicados" value="published" />
              <Tab label="Rascunhos" value="draft" />
              <Tab label="Pendentes" value="pending" />
              <Tab label="Lixeira" value="deleted" />
            </Tabs>
            {items && !isEmpty(items) ? (
              <Box mt={1}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Tipo</TableCell>
                      <TableCell align="left">Titulo</TableCell>
                      <TableCell align="left">Autor</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {items.map(item => (
                      <TableRow key={item._id}>
                        <TableCell align="left">
                          {item.type === 'book' && <BookIcon />}
                          {item.type === 'article' && <ArticleIcon />}
                          {item.type === 'video' && <VideoIcon />}
                        </TableCell>
                        <TableCell align="left">{item.title}</TableCell>
                        <TableCell align="left">{item.author}</TableCell>
                        <TableCell align="right">
                          {item.status === 'published' && (
                            <Published item={item} deleteItem={props.deleteItem} />
                          )}
                          {item.status === 'draft' && (
                            <Draft item={item} approveItem={props.approveItem} />
                          )}
                          {item.status === 'pending' && (
                            <Pending item={item} approveItem={props.approveItem} />
                          )}
                          {item.status === 'deleted' && (
                            <Trash item={item} approveItem={props.approveItem} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={total}
                  rowsPerPage={20}
                  page={clientCurrentPage - 1}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page'
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page'
                  }}
                  onChangePage={(e, page) => setCurrentPage(page + 1)}
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} de ${count}`
                  }
                />
              </Box>
            ) : (
                <Box p={2}>
                  <Typography variant="body2">Nenhum item encontrado.</Typography>
                </Box>
              )}
          </Paper>
        </Box>
      </Container>
    </>
  );
}

const mapStateToProps = state => ({
  items: state.collection.allItems,
  categories: state.categories
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { fetchAllItems, deleteItem, approveItem, fetchAllCategories },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Books);
