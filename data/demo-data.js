/**
 * NagarSathi - AI-Powered Road Maintenance & Infrastructure Management Platform
 * Demo Data Repository (Ghaziabad Municipal Corporation - Zone 3 Telemetry)
 *
 * NOTE: All data herein is illustrative DEMO DATA designed for hackathon evaluation
 * and prototype validation. Not connected to real municipal live databases.
 */

const DEMO_REPORTS = [
  {
    id: "NS-2026-1042",
    title: "Deep Crater Pothole near ALT Circle",
    category: "Pothole",
    location: "Master Plan Road, Sector 14, Raj Nagar, Ghaziabad",
    landmark: "50m from ALT Training Centre Circle",
    lat: 28.6920,
    lng: 77.4380,
    priority: "High",
    status: "Repair in Progress",
    date: "2026-10-14",
    reporter: "Citizen (Mobile App)",
    description: "Deep pothole (~14cm depth) right on the fast lane. Multiple two-wheelers observed losing balance during evening peak hours.",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "",
    estimatedCost: 38500,
    dimensions: "1.4m x 0.8m x 14cm",
    aiClassification: {
      predictedType: "Pothole",
      confidence: 96.4,
      severityGrade: "Critical (Grade 4)",
      boundingArea: "0.82 sq.m"
    },
    riskScore: 92,
    scoreBreakdown: {
      severity: 38, // out of 40
      trafficVolume: 24, // out of 25
      repeatReports: 18, // out of 20
      agingFactor: 12 // out of 15
    },
    verifiedByInspector: true,
    inspectorName: "Er. Alok Verma (AE - Ward 14)",
    ward: "Ward 14 (Raj Nagar)",
    contractor: "Shree Ganesh Infra Con",
    lastUpdated: "2026-10-15 14:30"
  },
  {
    id: "NS-2026-1041",
    title: "Extensive Alligator Cracks & Surface Breakup",
    category: "Road Crack",
    location: "C-Block Main Market Road, Kavi Nagar, Ghaziabad",
    landmark: "Opposite Community Centre Gate 2",
    lat: 28.6720,
    lng: 77.4485,
    priority: "Medium",
    status: "Under Review",
    date: "2026-10-13",
    reporter: "RWA Secretary (Web Portal)",
    description: "Extensive interconnected alligator cracks spreading along a 40-meter stretch. Water seepage is weakening the sub-base.",
    imageUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "",
    estimatedCost: 65000,
    dimensions: "42m x 2.2m surface web",
    aiClassification: {
      predictedType: "Road Crack (Fatigue)",
      confidence: 91.8,
      severityGrade: "Moderate (Grade 2)",
      boundingArea: "92 sq.m"
    },
    riskScore: 68,
    scoreBreakdown: {
      severity: 24,
      trafficVolume: 18,
      repeatReports: 14,
      agingFactor: 12
    },
    verifiedByInspector: false,
    inspectorName: "Pending Assignment",
    ward: "Ward 22 (Kavi Nagar)",
    contractor: "Unassigned",
    lastUpdated: "2026-10-13 10:15"
  },
  {
    id: "NS-2026-1040",
    title: "Severe Monsoon Waterlogging & Surface Erosion",
    category: "Waterlogging",
    location: "Kala Patthar Road, Vaibhav Khand, Indirapuram",
    landmark: "Near Aditya Mall Junction",
    lat: 28.6360,
    lng: 77.3690,
    priority: "High",
    status: "Reported",
    date: "2026-10-15",
    reporter: "Citizen (Direct Upload)",
    description: "Clogged stormwater drains causing 1.5 ft standing water after rain. Underlying bitumen is stripping and exposing coarse gravel.",
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "",
    estimatedCost: 115000,
    dimensions: "65m drainage & patch stretch",
    aiClassification: {
      predictedType: "Waterlogging & Bitumen Stripping",
      confidence: 94.1,
      severityGrade: "Severe (Grade 4)",
      boundingArea: "150 sq.m"
    },
    riskScore: 89,
    scoreBreakdown: {
      severity: 36,
      trafficVolume: 25,
      repeatReports: 16,
      agingFactor: 12
    },
    verifiedByInspector: false,
    inspectorName: "Pending Assignment",
    ward: "Ward 08 (Indirapuram)",
    contractor: "Unassigned",
    lastUpdated: "2026-10-15 08:20"
  },
  {
    id: "NS-2026-1039",
    title: "Repaired Bitumen Patch at Sector 11 Junction",
    category: "Pothole",
    location: "Sector 11 Main Arterial, Vasundhara, Ghaziabad",
    landmark: "Adjoining Maharaja Agrasen Public School",
    lat: 28.6580,
    lng: 77.3750,
    priority: "High",
    status: "Resolved",
    date: "2026-10-09",
    reporter: "Traffic Police Ward 11",
    description: "Major pothole cluster that caused several congestion delays. Cold-mix asphalt patch applied and rolled successfully.",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "https://images.unsplash.com/photo-1584463699042-4943f60505a7?auto=format&fit=crop&w=600&q=80",
    estimatedCost: 28000,
    dimensions: "2.1m x 1.2m repaired",
    aiClassification: {
      predictedType: "Pothole (Repaired)",
      confidence: 97.2,
      severityGrade: "Resolved (Grade 0)",
      boundingArea: "2.5 sq.m"
    },
    riskScore: 15,
    scoreBreakdown: {
      severity: 0,
      trafficVolume: 10,
      repeatReports: 0,
      agingFactor: 5
    },
    verifiedByInspector: true,
    inspectorName: "Er. Ramesh Chandra (GMC Quality Wing)",
    ward: "Ward 11 (Vasundhara)",
    contractor: "Apex Roadways Ltd",
    lastUpdated: "2026-10-14 17:00"
  },
  {
    id: "NS-2026-1038",
    title: "Edge Ravelling & Shoulder Breakdown",
    category: "Surface Damage",
    location: "Internal Ring Road, Crossings Republik, Ghaziabad",
    landmark: "Near Crossings Glass Gate",
    lat: 28.6290,
    lng: 77.4320,
    priority: "Medium",
    status: "Repair in Progress",
    date: "2026-10-11",
    reporter: "Citizen (Web Portal)",
    description: "Road edge broken away due to heavy construction trucks. Narrowing driving corridor significantly.",
    imageUrl: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "",
    estimatedCost: 48000,
    dimensions: "18m shoulder length",
    aiClassification: {
      predictedType: "Edge Ravelling",
      confidence: 89.5,
      severityGrade: "Moderate (Grade 3)",
      boundingArea: "36 sq.m"
    },
    riskScore: 71,
    scoreBreakdown: {
      severity: 26,
      trafficVolume: 20,
      repeatReports: 12,
      agingFactor: 13
    },
    verifiedByInspector: true,
    inspectorName: "Er. Preeti Yadav (JE)",
    ward: "Ward 34 (Crossings)",
    contractor: "Shree Ganesh Infra Con",
    lastUpdated: "2026-10-15 11:20"
  },
  {
    id: "NS-2026-1037",
    title: "Sunken Manhole Cover creating 5-inch Dip",
    category: "Other",
    location: "Mohan Nagar Flyover Service Road",
    landmark: "Near World Square Mall Metro exit",
    lat: 28.6790,
    lng: 77.3910,
    priority: "High",
    status: "Under Review",
    date: "2026-10-12",
    reporter: "Auto Drivers Union",
    description: "Sewer manhole collar has sunk 12 cm below the newly laid asphalt surface. High collision hazard for night commuters.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "",
    estimatedCost: 32000,
    dimensions: "0.9m diameter frame reset",
    aiClassification: {
      predictedType: "Sunken Utility Frame",
      confidence: 93.3,
      severityGrade: "High Hazard (Grade 4)",
      boundingArea: "1.2 sq.m"
    },
    riskScore: 86,
    scoreBreakdown: {
      severity: 35,
      trafficVolume: 25,
      repeatReports: 16,
      agingFactor: 10
    },
    verifiedByInspector: true,
    inspectorName: "Er. Alok Verma (AE)",
    ward: "Ward 05 (Mohan Nagar)",
    contractor: "Unassigned",
    lastUpdated: "2026-10-14 09:10"
  },
  {
    id: "NS-2026-1036",
    title: "Longitudinal Trench Cracking after Pipeline Work",
    category: "Road Crack",
    location: "Govindpuram Main Boulevard",
    landmark: "Between Gate 1 and GDA Market",
    lat: 28.6960,
    lng: 77.4890,
    priority: "Low",
    status: "Reported",
    date: "2026-10-14",
    reporter: "Local Resident",
    description: "Poorly consolidated utility trench cut has subsided leaving a 20-meter linear fissure.",
    imageUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "",
    estimatedCost: 22000,
    dimensions: "24m length x 0.15m width",
    aiClassification: {
      predictedType: "Longitudinal Trench Crack",
      confidence: 88.0,
      severityGrade: "Low (Grade 1)",
      boundingArea: "12 sq.m"
    },
    riskScore: 42,
    scoreBreakdown: {
      severity: 15,
      trafficVolume: 12,
      repeatReports: 8,
      agingFactor: 7
    },
    verifiedByInspector: false,
    inspectorName: "Pending Assignment",
    ward: "Ward 41 (Govindpuram)",
    contractor: "Unassigned",
    lastUpdated: "2026-10-14 16:45"
  },
  {
    id: "NS-2026-1035",
    title: "Surface Stripping & Aggregate Exposure",
    category: "Surface Damage",
    location: "Shastri Nagar Central Avenue, Block B",
    landmark: "Near Brij Mohan Hospital",
    lat: 28.6620,
    lng: 77.4610,
    priority: "Low",
    status: "Resolved",
    date: "2026-10-06",
    reporter: "Citizen (Mobile App)",
    description: "Upper wearing coat worn away by continuous brake friction near speed table. Resurfaced with micro-surfacing emulsion.",
    imageUrl: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "https://images.unsplash.com/photo-1584463699042-4943f60505a7?auto=format&fit=crop&w=600&q=80",
    estimatedCost: 19500,
    dimensions: "30 sq.m resurfacing",
    aiClassification: {
      predictedType: "Surface Ravelling",
      confidence: 92.5,
      severityGrade: "Resolved (Grade 0)",
      boundingArea: "30 sq.m"
    },
    riskScore: 12,
    scoreBreakdown: {
      severity: 0,
      trafficVolume: 6,
      repeatReports: 2,
      agingFactor: 4
    },
    verifiedByInspector: true,
    inspectorName: "Er. Ramesh Chandra (GMC)",
    ward: "Ward 19 (Shastri Nagar)",
    contractor: "Apex Roadways Ltd",
    lastUpdated: "2026-10-11 12:00"
  },
  {
    id: "NS-2026-1034",
    title: "Cluster of 3 Potholes on Metro Pillar Descent",
    category: "Pothole",
    location: "Sector 4 Vaishali, Madan Mohan Malviya Marg",
    landmark: "Pillar 112, Vaishali Metro Route",
    lat: 28.6480,
    lng: 77.3420,
    priority: "High",
    status: "Repair in Progress",
    date: "2026-10-10",
    reporter: "Bus Rapid Transit Marshal",
    description: "Three consecutive potholes in the bus lane causing sudden swerving into regular car traffic lanes. Urgent hazard.",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "",
    estimatedCost: 52000,
    dimensions: "3 pits, total 4.2 sq.m",
    aiClassification: {
      predictedType: "Pothole Cluster",
      confidence: 95.7,
      severityGrade: "High Hazard (Grade 4)",
      boundingArea: "4.2 sq.m"
    },
    riskScore: 94,
    scoreBreakdown: {
      severity: 39,
      trafficVolume: 25,
      repeatReports: 18,
      agingFactor: 12
    },
    verifiedByInspector: true,
    inspectorName: "Er. Preeti Yadav (JE)",
    ward: "Ward 04 (Vaishali)",
    contractor: "Shree Ganesh Infra Con",
    lastUpdated: "2026-10-15 15:40"
  },
  {
    id: "NS-2026-1033",
    title: "Heavy Industrial Route Rutting & Pavement Depression",
    category: "Surface Damage",
    location: "Site IV Industrial Area, Sahibabad",
    landmark: "Near Bikaner Chowk Entry",
    lat: 28.6650,
    lng: 77.3550,
    priority: "Medium",
    status: "Under Review",
    date: "2026-10-08",
    reporter: "Industrial Association (SIA)",
    description: "Wheel path depressions along 100m road section due to overloaded container trailers. High hydroplaning risk during rain.",
    imageUrl: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "",
    estimatedCost: 88000,
    dimensions: "110m rut length",
    aiClassification: {
      predictedType: "Pavement Rutting",
      confidence: 90.2,
      severityGrade: "Moderate (Grade 3)",
      boundingArea: "120 sq.m"
    },
    riskScore: 74,
    scoreBreakdown: {
      severity: 28,
      trafficVolume: 22,
      repeatReports: 12,
      agingFactor: 12
    },
    verifiedByInspector: false,
    inspectorName: "Pending Assignment",
    ward: "Ward 02 (Sahibabad)",
    contractor: "Unassigned",
    lastUpdated: "2026-10-12 18:00"
  },
  {
    id: "NS-2026-1032",
    title: "Dangerous Transverse Heave near Old Bus Stand",
    category: "Surface Damage",
    location: "GT Road Arterial, Near Railway Overbridge",
    landmark: "200m from Ghaziabad Old Bus Stand",
    lat: 28.6670,
    lng: 77.4350,
    priority: "High",
    status: "Resolved",
    date: "2026-10-04",
    reporter: "City Traffic Inspector",
    description: "Pavement buckling caused a sharp 8cm ridge across lanes. Milled flat and sealed with high-stability DBM layer.",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "https://images.unsplash.com/photo-1584463699042-4943f60505a7?auto=format&fit=crop&w=600&q=80",
    estimatedCost: 41000,
    dimensions: "8m transversal heave",
    aiClassification: {
      predictedType: "Pavement Heave / Buckle",
      confidence: 94.8,
      severityGrade: "Resolved (Grade 0)",
      boundingArea: "16 sq.m"
    },
    riskScore: 18,
    scoreBreakdown: {
      severity: 0,
      trafficVolume: 12,
      repeatReports: 0,
      agingFactor: 6
    },
    verifiedByInspector: true,
    inspectorName: "Er. Alok Verma (AE)",
    ward: "Ward 17 (City Central)",
    contractor: "Apex Roadways Ltd",
    lastUpdated: "2026-10-10 16:30"
  },
  {
    id: "NS-2026-1031",
    title: "Corridor Pothole Hazard on Meerut Road Link",
    category: "Pothole",
    location: "Meerut Road Industrial Corridor (NH-58 Link)",
    landmark: "Opposite DPS Ghaziabad Turning",
    lat: 28.7050,
    lng: 77.4290,
    priority: "High",
    status: "Reported",
    date: "2026-10-15",
    reporter: "Citizen (Web Portal)",
    description: "Fresh pothole caused by heavy downpour yesterday. Sharp gravel exposed; danger of rim damage at highway speeds.",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "",
    estimatedCost: 35000,
    dimensions: "1.1m x 0.9m x 11cm",
    aiClassification: {
      predictedType: "Pothole (Arterial)",
      confidence: 95.1,
      severityGrade: "High (Grade 4)",
      boundingArea: "1.0 sq.m"
    },
    riskScore: 91,
    scoreBreakdown: {
      severity: 37,
      trafficVolume: 25,
      repeatReports: 17,
      agingFactor: 12
    },
    verifiedByInspector: false,
    inspectorName: "Pending Assignment",
    ward: "Ward 12 (Meerut Road)",
    contractor: "Unassigned",
    lastUpdated: "2026-10-15 19:15"
  }
];

// Municipal zone statistics for Ghaziabad Zone 3
const DEMO_WARDS = [
  { id: "W14", name: "Ward 14 (Raj Nagar)", inspector: "Er. Alok Verma", activeIssues: 3, resolvedMonth: 14 },
  { id: "W22", name: "Ward 22 (Kavi Nagar)", inspector: "Er. Ramesh Chandra", activeIssues: 2, resolvedMonth: 11 },
  { id: "W08", name: "Ward 08 (Indirapuram)", inspector: "Er. Preeti Yadav", activeIssues: 5, resolvedMonth: 19 },
  { id: "W11", name: "Ward 11 (Vasundhara)", inspector: "Er. Alok Verma", activeIssues: 1, resolvedMonth: 16 },
  { id: "W34", name: "Ward 34 (Crossings)", inspector: "Er. Preeti Yadav", activeIssues: 3, resolvedMonth: 9 },
  { id: "W04", name: "Ward 04 (Vaishali)", inspector: "Er. Ramesh Chandra", activeIssues: 2, resolvedMonth: 13 }
];

// Sample images that users can click to easily test the report damage form
const SAMPLE_TEST_IMAGES = [
  {
    name: "Severe Pothole (Sample 1)",
    category: "Pothole",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    description: "Deep jagged pothole on asphalt road"
  },
  {
    name: "Alligator Surface Cracks (Sample 2)",
    category: "Road Crack",
    url: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80",
    description: "Interconnected fatigue road fractures"
  },
  {
    name: "Road Waterlogging (Sample 3)",
    category: "Waterlogging",
    url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80",
    description: "Submerged roadway with asphalt wear"
  },
  {
    name: "Edge Breakdown (Sample 4)",
    category: "Surface Damage",
    url: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80",
    description: "Eroded road shoulder and ravelling"
  }
];

// Sample duplicate report candidate pairs for AI Insights demonstration
const DEMO_DUPLICATES = [
  {
    primaryId: "NS-2026-1040",
    duplicateId: "NS-2026-1043 (Suggested Merge)",
    location: "Kala Patthar Road, Indirapuram",
    distanceMeters: 14.5,
    visualSimilarity: 93.4,
    reporterCount: 7,
    status: "Pending Human Confirmation",
    recommendation: "Merge into primary ticket NS-2026-1040 to prevent contractor double-billing"
  },
  {
    primaryId: "NS-2026-1034",
    duplicateId: "NS-2026-1029 (Suggested Merge)",
    location: "Sector 4 Vaishali Metro Pillar 112",
    distanceMeters: 6.2,
    visualSimilarity: 96.1,
    reporterCount: 12,
    status: "Pending Human Confirmation",
    recommendation: "Cluster candidate: 3 distinct citizens reported same pothole cluster within 24h"
  }
];

// Sample predictive maintenance corridor risks
const DEMO_RISK_CORRIDORS = [
  {
    corridor: "Meerut Road (NH-58 Link)",
    riskLevel: "High Risk",
    riskClass: "danger",
    repeatCount: "19 potholes / 2.5km",
    rootCause: "Heavy overloaded commercial multi-axle freight traffic",
    suggestedAction: "Full-depth asphalt mill and 60mm DBM resurfacing before monsoon"
  },
  {
    corridor: "Kala Patthar Arterial (Indirapuram)",
    riskLevel: "High Risk",
    riskClass: "danger",
    repeatCount: "14 waterlogging & pit points",
    rootCause: "Stormwater invert elevation mismatch causing backflow",
    suggestedAction: "Catch basin reconstruction + polymer-modified binder overlay"
  },
  {
    corridor: "Kavi Nagar C-Block Commercial Corridor",
    riskLevel: "Medium Risk",
    riskClass: "warning",
    repeatCount: "8 crack networks",
    rootCause: "Aging sub-base wear, last resurfaced 2018",
    suggestedAction: "Slurry seal crack repair within 30 days to halt moisture penetration"
  },
  {
    corridor: "Vasundhara Sector 11 Loop",
    riskLevel: "Low Risk",
    riskClass: "success",
    repeatCount: "2 minor spots",
    rootCause: "Routine surface abrasion",
    suggestedAction: "Routine preventive patrol scheduled next quarter"
  }
];

// Monthly trend data for charts (past 6 months)
const DEMO_CHART_TRENDS = {
  months: ["May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026"],
  reported: [42, 68, 124, 158, 92, 54], // Monsoon spike in July-August
  resolved: [39, 52, 98, 134, 104, 76]
};

// Export to window for vanilla JS access across pages
window.NagarSathiDemo = {
  DEMO_REPORTS,
  DEMO_WARDS,
  SAMPLE_TEST_IMAGES,
  DEMO_DUPLICATES,
  DEMO_RISK_CORRIDORS,
  DEMO_CHART_TRENDS
};
