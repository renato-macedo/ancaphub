import React from 'react';
import {
  Container,
  Box
} from '@material-ui/core';
import Hero from '../../components/template/hero';
import TitleComponent from '../../components/template/titleComponent';

export default function Settings() {
  return (
    <>
      <TitleComponent title="Configurações" />
      <Hero title="Configurações" />

      <Box mt={3}>
        <Container>Página em Construção.</Container>
      </Box>
    </>
  );
}
