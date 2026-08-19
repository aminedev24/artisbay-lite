import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import parse from 'html-react-parser';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#333',
  },
  heading2: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
    color: '#2c3e50',
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 1.6,
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 5,
  },
});

// Function to render each part of content
const renderContentPart = (contentPart) => {
  if (typeof contentPart === 'string') {
    // Check if content contains HTML tags
    if (/<[a-z][\s\S]*>/i.test(contentPart)) {
      // Parse and render HTML content
      return parse(contentPart, {
        replace: (domNode) => {
          if (domNode.type === 'tag') {
            switch (domNode.name) {
              case 'h2':
                return <Text style={styles.heading2}>{parse(domNode.children)}</Text>;
              case 'p':
                return <Text style={styles.paragraph}>{parse(domNode.children)}</Text>;
              case 'li':
                return <Text style={styles.listItem}>• {parse(domNode.children)}</Text>;
              default:
                return <Text>{parse(domNode.children)}</Text>;
            }
          }
        },
      });
    }
    // Render plain text directly
    return <Text style={styles.paragraph}>{contentPart}</Text>;
  }
  return null;
};

// Main PDF component to handle full content
const DynamicAgreementPDF = ({ fullContent }) => (
  <Document>
    <Page style={styles.page}>
      {fullContent.map((contentPart, index) => (
        <View key={index}>{renderContentPart(contentPart)}</View>
      ))}
    </Page>
  </Document>
);

export default DynamicAgreementPDF;
