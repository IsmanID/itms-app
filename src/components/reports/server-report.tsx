"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: "Helvetica" },
  header: { marginBottom: 20, borderBottom: 1, paddingBottom: 10, flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "bold", color: "#2563eb" },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", backgroundColor: "#f3f4f6", padding: 4, marginBottom: 8 },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { width: 120, fontWeight: "bold" },
  value: { flex: 1 },
  table: { width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "#e5e7eb" },
  tableHeader: { backgroundColor: "#f9fafb", flexDirection: "row", fontWeight: "bold", borderBottomWidth: 1, borderColor: "#e5e7eb" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#e5e7eb" },
  tableCol: { padding: 4, flex: 1 },
  signatureSection: { flexDirection: "row", marginTop: 40, justifyContent: "space-around" },
  signatureBox: { width: 200, alignItems: "center" },
  signatureImage: { width: 150, height: 60, borderBottom: 1, borderColor: "#000", marginBottom: 5, objectFit: "contain" },
});

export const ServerReportPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>MAINTENANCE REPORT</Text>
          <Text>IT Managed Service - Server Log</Text>
        </View>
        <View style={{ textAlign: "right" }}>
          <Text>Log No: {data.logNumber}</Text>
          <Text>Date: {format(new Date(data.date), "PPP")}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. INCIDENT INFORMATION</Text>
        <View style={styles.row}><Text style={styles.label}>Asset Tag:</Text><Text style={styles.value}>{data.assetTag}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Service Type:</Text><Text style={styles.value}>{data.serviceType}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Time:</Text><Text style={styles.value}>{data.startTime} - {data.endTime}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Problem:</Text><Text style={styles.value}>{data.problemDescription}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Correction:</Text><Text style={styles.value}>{data.correction}</Text></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. HARDWARE SPECIFICATIONS</Text>
        <View style={styles.row}><Text style={styles.label}>CPU:</Text><Text style={styles.value}>{data.hardwareSpecs.cpu}</Text></View>
        <View style={styles.row}><Text style={styles.label}>RAM:</Text><Text style={styles.value}>{data.hardwareSpecs.ram}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Storage:</Text><Text style={styles.value}>{data.hardwareSpecs.storage}</Text></View>
        <View style={styles.row}><Text style={styles.label}>NIC:</Text><Text style={styles.value}>{data.hardwareSpecs.nic}</Text></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. PERFORMANCE METRICS</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol}>Counter</Text>
            <Text style={styles.tableCol}>Last</Text>
            <Text style={styles.tableCol}>Avg</Text>
            <Text style={styles.tableCol}>Min</Text>
            <Text style={styles.tableCol}>Max</Text>
          </View>
          {data.performanceMetrics.map((m: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCol}>{m.scale} - {m.counter}</Text>
              <Text style={styles.tableCol}>{m.last}</Text>
              <Text style={styles.tableCol}>{m.avg}</Text>
              <Text style={styles.tableCol}>{m.min}</Text>
              <Text style={styles.tableCol}>{m.max}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureBox}>
          {data.engineerSignature && <Image src={data.engineerSignature} style={styles.signatureImage} />}
          <Text>Engineer Name</Text>
          <Text>(IT Support)</Text>
        </View>
        <View style={styles.signatureBox}>
          {data.customerSignature && <Image src={data.customerSignature} style={styles.signatureImage} />}
          <Text>Customer Name</Text>
          <Text>(Client Sign-off)</Text>
        </View>
      </View>
    </Page>
  </Document>
);
