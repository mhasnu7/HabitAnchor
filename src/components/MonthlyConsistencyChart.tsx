import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 32; // Screen width minus padding

interface MonthlyData {
  month: string;
  completedDays: number;
}

interface MonthlyConsistencyChartProps {
  data: MonthlyData[];
  habitColor: string;
}

const MonthlyConsistencyChart: React.FC<MonthlyConsistencyChartProps> = ({ data, habitColor }) => {
  const { theme } = useTheme();

  if (data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={{ color: theme.subtleText }}>No completion data available for monthly analysis.</Text>
      </View>
    );
  }

  // Determine the maximum number of completed days in any month
  const maxCompletedDays = Math.max(...data.map(d => d.completedDays));

  return (
    <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.chartTitle, { color: theme.text }]}>Monthly Consistency</Text>
      <View style={styles.chart}>
        {data.map((item, index) => {
          const barHeight = (item.completedDays / maxCompletedDays) * 100; // Max height is 100 units
          return (
            <View key={index} style={styles.barWrapper}>
              <View style={[styles.bar, { height: `${barHeight}%`, backgroundColor: habitColor }]} />
              <Text style={[styles.barLabel, { color: theme.subtleText }]}>{item.month.substring(0, 3)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150, // Fixed height for the chart area
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Placeholder for axis line
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginHorizontal: 4,
  },
  bar: {
    width: '80%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 20,
  }
});

export default MonthlyConsistencyChart;