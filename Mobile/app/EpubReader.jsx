import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const EpubReader = () => {
  // const [htmlContent, setHtmlContent] = useState(null);

  // const openEpub = async () => {
  //   try {
  //     // Caminho do arquivo EPUB
  //     const epubPath = `${RNFS.DocumentDirectoryPath}/example.epub`;
  //     const unzipPath = `${RNFS.DocumentDirectoryPath}/unzipped_epub`;

  //     // Descompactar o EPUB
  //     await unzip(epubPath, unzipPath);

  //     // Ler o conteúdo inicial (geralmente no arquivo `index.xhtml` ou no spine do EPUB)
  //     const contentPath = `${unzipPath}/OEBPS/index.xhtml`; // Verifique o caminho correto para seu arquivo EPUB.
  //     const content = await RNFS.readFile(contentPath, "utf8");

  //     // Renderizar o conteúdo HTML no WebView
  //     setHtmlContent(content);
  //   } catch (error) {
  //     console.error("Erro ao abrir EPUB:", error);
  //   }
  // };

  // useEffect(() => {
  //   // Baixe ou disponibilize o EPUB localmente antes de abrir
  //   openEpub();
  // }, []);

  return (
    <View style={styles.container}>
      ola mundo
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
});

export default EpubReader;
