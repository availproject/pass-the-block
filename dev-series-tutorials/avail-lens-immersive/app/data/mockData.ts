// Color palette
export const colors = {
  primary: '#3CA3FC',    // Primary Blue
  secondary: '#58C8F6',  // Light Blue
  tertiary: '#44D5DE',   // Mint
  accent1: '#EDC7FC',    // Purple
  accent2: '#FEC7C7',    // Pink
  edges: '#BCE3FE',      // Light edge color for better visibility
};

export const mockData = {
  nodes: [
    // Cluster 1 - robin.lens
    { id: '1', label: 'robin.lens', position: [-15, 10, -5] as [number, number, number], color: colors.primary },
    { id: '2', label: 'Follower 1.1', position: [-18, 13, -8] as [number, number, number], color: colors.secondary },
    { id: '3', label: 'Follower 1.2', position: [-12, 13, -2] as [number, number, number], color: colors.secondary },
    { id: '4', label: 'Follower 1.3', position: [-11, 10, -7] as [number, number, number], color: colors.secondary },
    { id: '5', label: 'Follower 1.4', position: [-12, 7, -3] as [number, number, number], color: colors.secondary },
    { id: '6', label: 'Follower 1.5', position: [-18, 7, -8] as [number, number, number], color: colors.secondary },
    { id: '7', label: 'Follower 1.6', position: [-19, 10, -2] as [number, number, number], color: colors.secondary },

    // Cluster 2 - scott.lens
    { id: '8', label: 'scott.lens', position: [0, 15, 0] as [number, number, number], color: colors.tertiary },
    { id: '9', label: 'Follower 2.1', position: [-3, 18, 3] as [number, number, number], color: colors.accent1 },
    { id: '10', label: 'Follower 2.2', position: [3, 18, -3] as [number, number, number], color: colors.accent1 },
    { id: '11', label: 'Follower 2.3', position: [4, 15, 4] as [number, number, number], color: colors.accent1 },
    { id: '12', label: 'Follower 2.4', position: [3, 12, -2] as [number, number, number], color: colors.accent1 },
    { id: '13', label: 'Follower 2.5', position: [-3, 12, 3] as [number, number, number], color: colors.accent1 },
    { id: '14', label: 'Follower 2.6', position: [-4, 15, -4] as [number, number, number], color: colors.accent1 },

    // Cluster 3 - christine.lens
    { id: '15', label: 'christine.lens', position: [15, 0, 5] as [number, number, number], color: colors.tertiary },
    { id: '16', label: 'Follower 3.1', position: [12, 3, 8] as [number, number, number], color: colors.accent2 },
    { id: '17', label: 'Follower 3.2', position: [18, 3, 2] as [number, number, number], color: colors.accent2 },
    { id: '18', label: 'Follower 3.3', position: [19, 0, 9] as [number, number, number], color: colors.accent2 },
    { id: '19', label: 'Follower 3.4', position: [18, -3, 3] as [number, number, number], color: colors.accent2 },
    { id: '20', label: 'Follower 3.5', position: [12, -3, 7] as [number, number, number], color: colors.accent2 },
    { id: '21', label: 'Follower 3.6', position: [11, 0, 1] as [number, number, number], color: colors.accent2 },

    // Cluster 4 - avail.lens
    { id: '22', label: 'avail.lens', position: [0, -15, 10] as [number, number, number], color: colors.primary },
    { id: '23', label: 'Follower 4.1', position: [-3, -12, 13] as [number, number, number], color: colors.secondary },
    { id: '24', label: 'Follower 4.2', position: [3, -12, 7] as [number, number, number], color: colors.secondary },
    { id: '25', label: 'Follower 4.3', position: [4, -15, 14] as [number, number, number], color: colors.secondary },
    { id: '26', label: 'Follower 4.4', position: [3, -18, 8] as [number, number, number], color: colors.secondary },
    { id: '27', label: 'Follower 4.5', position: [-3, -18, 12] as [number, number, number], color: colors.secondary },
    { id: '28', label: 'Follower 4.6', position: [-4, -15, 6] as [number, number, number], color: colors.secondary },

    // Cluster 5 - naruto.lens
    { id: '29', label: 'naruto.lens', position: [-15, -15, 15] as [number, number, number], color: colors.tertiary },
    { id: '30', label: 'Follower 5.1', position: [-18, -12, 18] as [number, number, number], color: colors.accent1 },
    { id: '31', label: 'Follower 5.2', position: [-12, -12, 12] as [number, number, number], color: colors.accent1 },
    { id: '32', label: 'Follower 5.3', position: [-11, -15, 19] as [number, number, number], color: colors.accent1 },
    { id: '33', label: 'Follower 5.4', position: [-12, -18, 13] as [number, number, number], color: colors.accent1 },
    { id: '34', label: 'Follower 5.5', position: [-18, -18, 17] as [number, number, number], color: colors.accent1 },
    { id: '35', label: 'Follower 5.6', position: [-19, -15, 11] as [number, number, number], color: colors.accent1 },

    // Cluster 6 - dan.lens
    { id: '36', label: 'dan.lens', position: [15, 15, 20] as [number, number, number], color: colors.primary },
    { id: '37', label: 'Follower 6.1', position: [12, 18, 20] as [number, number, number], color: colors.secondary },
    { id: '38', label: 'Follower 6.2', position: [18, 18, 20] as [number, number, number], color: colors.secondary },
    { id: '39', label: 'Follower 6.3', position: [19, 15, 20] as [number, number, number], color: colors.secondary },
    { id: '40', label: 'Follower 6.4', position: [18, 12, 20] as [number, number, number], color: colors.secondary },
    { id: '41', label: 'Follower 6.5', position: [12, 12, 20] as [number, number, number], color: colors.secondary },
    { id: '42', label: 'Follower 6.6', position: [11, 15, 20] as [number, number, number], color: colors.secondary },

    // Cluster 7 - rishabh.lens
    { id: '43', label: 'rishabh.lens', position: [-30, 0, 25] as [number, number, number], color: colors.tertiary },
    { id: '44', label: 'Follower 7.1', position: [-33, 3, 25] as [number, number, number], color: colors.accent1 },
    { id: '45', label: 'Follower 7.2', position: [-27, 3, 25] as [number, number, number], color: colors.accent1 },
    { id: '46', label: 'Follower 7.3', position: [-26, 0, 25] as [number, number, number], color: colors.accent1 },
    { id: '47', label: 'Follower 7.4', position: [-27, -3, 25] as [number, number, number], color: colors.accent1 },
    { id: '48', label: 'Follower 7.5', position: [-33, -3, 25] as [number, number, number], color: colors.accent1 },
    { id: '49', label: 'Follower 7.6', position: [-34, 0, 25] as [number, number, number], color: colors.accent1 },

    // Cluster 8 - priyank.lens
    { id: '50', label: 'priyank.lens', position: [30, 0, 30] as [number, number, number], color: colors.primary },
    { id: '51', label: 'Follower 8.1', position: [27, 3, 30] as [number, number, number], color: colors.secondary },
    { id: '52', label: 'Follower 8.2', position: [33, 3, 30] as [number, number, number], color: colors.secondary },
    { id: '53', label: 'Follower 8.3', position: [34, 0, 30] as [number, number, number], color: colors.secondary },
    { id: '54', label: 'Follower 8.4', position: [33, -3, 30] as [number, number, number], color: colors.secondary },
    { id: '55', label: 'Follower 8.5', position: [27, -3, 30] as [number, number, number], color: colors.secondary },
    { id: '56', label: 'Follower 8.6', position: [26, 0, 30] as [number, number, number], color: colors.secondary },

    // Cluster 9 - kyle.lens
    { id: '57', label: 'kyle.lens', position: [0, 30, 35] as [number, number, number], color: colors.tertiary },
    { id: '58', label: 'Follower 9.1', position: [-3, 33, 35] as [number, number, number], color: colors.accent2 },
    { id: '59', label: 'Follower 9.2', position: [3, 33, 35] as [number, number, number], color: colors.accent2 },
    { id: '60', label: 'Follower 9.3', position: [4, 30, 35] as [number, number, number], color: colors.accent2 },
    { id: '61', label: 'Follower 9.4', position: [3, 27, 35] as [number, number, number], color: colors.accent2 },
    { id: '62', label: 'Follower 9.5', position: [-3, 27, 35] as [number, number, number], color: colors.accent2 },
    { id: '63', label: 'Follower 9.6', position: [-4, 30, 35] as [number, number, number], color: colors.accent2 },

    // Cluster 10 - chandler.lens
    { id: '64', label: 'chandler.lens', position: [0, -30, 40] as [number, number, number], color: colors.primary },
    { id: '65', label: 'Follower 10.1', position: [-3, -27, 40] as [number, number, number], color: colors.secondary },
    { id: '66', label: 'Follower 10.2', position: [3, -27, 40] as [number, number, number], color: colors.secondary },
    { id: '67', label: 'Follower 10.3', position: [4, -30, 40] as [number, number, number], color: colors.secondary },
    { id: '68', label: 'Follower 10.4', position: [3, -33, 40] as [number, number, number], color: colors.secondary },
    { id: '69', label: 'Follower 10.5', position: [-3, -33, 40] as [number, number, number], color: colors.secondary },
    { id: '70', label: 'Follower 10.6', position: [-4, -30, 40] as [number, number, number], color: colors.secondary },
  ],
  edges: [
    // Cluster 1 connections - robin.lens
    { source: '1', target: '2' },
    { source: '1', target: '3' },
    { source: '1', target: '4' },
    { source: '1', target: '5' },
    { source: '1', target: '6' },
    { source: '1', target: '7' },
    
    // Cluster 2 connections - scott.lens
    { source: '8', target: '9' },
    { source: '8', target: '10' },
    { source: '8', target: '11' },
    { source: '8', target: '12' },
    { source: '8', target: '13' },
    { source: '8', target: '14' },
    
    // Cluster 3 connections - christine.lens
    { source: '15', target: '16' },
    { source: '15', target: '17' },
    { source: '15', target: '18' },
    { source: '15', target: '19' },
    { source: '15', target: '20' },
    { source: '15', target: '21' },
    
    // Cluster 4 connections - avail.lens
    { source: '22', target: '23' },
    { source: '22', target: '24' },
    { source: '22', target: '25' },
    { source: '22', target: '26' },
    { source: '22', target: '27' },
    { source: '22', target: '28' },

    // Cluster 5 connections - naruto.lens
    { source: '29', target: '30' },
    { source: '29', target: '31' },
    { source: '29', target: '32' },
    { source: '29', target: '33' },
    { source: '29', target: '34' },
    { source: '29', target: '35' },

    // Cluster 6 connections - dan.lens
    { source: '36', target: '37' },
    { source: '36', target: '38' },
    { source: '36', target: '39' },
    { source: '36', target: '40' },
    { source: '36', target: '41' },
    { source: '36', target: '42' },

    // Cluster 7 connections - rishabh.lens
    { source: '43', target: '44' },
    { source: '43', target: '45' },
    { source: '43', target: '46' },
    { source: '43', target: '47' },
    { source: '43', target: '48' },
    { source: '43', target: '49' },

    // Cluster 8 connections - priyank.lens
    { source: '50', target: '51' },
    { source: '50', target: '52' },
    { source: '50', target: '53' },
    { source: '50', target: '54' },
    { source: '50', target: '55' },
    { source: '50', target: '56' },

    // Cluster 9 connections - kyle.lens
    { source: '57', target: '58' },
    { source: '57', target: '59' },
    { source: '57', target: '60' },
    { source: '57', target: '61' },
    { source: '57', target: '62' },
    { source: '57', target: '63' },

    // Cluster 10 connections - chandler.lens
    { source: '64', target: '65' },
    { source: '64', target: '66' },
    { source: '64', target: '67' },
    { source: '64', target: '68' },
    { source: '64', target: '69' },
    { source: '64', target: '70' },
  ],
}; 