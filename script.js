/**
 * Civil Construction Service (civilconstructionservice.com)
 * Family-Owned Sitework, Concrete & Utilities — Interactive Client Logic
 * project detail modal, ballpark estimate calculator, and free quote form.
 */

'use strict';

/* ==========================================================================
   Services & Local Project Data
   ========================================================================== */

const SERVICES = {
  excavation: {
    code: '01 / SITE PREP & EXCAVATION',
    title: 'Site Preparation, Land Clearing & Precision Grading',
    image: 'assets/project-excavation.jpg',
    imageAlt: 'Excavators grading earth and preparing a residential and commercial site pad',
    description:
      'Whether you are breaking ground on a new family home, clearing space for a barn or shop, or fixing backyard grading, our crew prepares clean, laser-leveled pads built on properly compacted ground.',
    specs: [
      { label: 'Typical Projects', value: 'House Pads, Shops, Barn Sites' },
      { label: 'Grading Accuracy', value: 'Laser-Controlled Cut & Fill' },
      { label: 'Site Care', value: 'Erosion Silt Fence & Clean Haul-Off' },
      { label: 'Utility Safety', value: '811 Locate & Hand-Dig Verification' },
    ],
    deliverables: [
      'Tree, brush & stump clearing with root raking',
      'Residential building pads & basement digs',
      'Rough & final lot grading for positive drainage',
      'Topsoil stripping, stockpiling & re-spreading',
    ],
    estimatorKey: 'excavation',
  },
  concrete: {
    code: '02 / CONCRETE & FOUNDATIONS',
    title: 'Foundations, Shop Slabs, Retaining Walls & Flatwork',
    image: 'assets/project-concrete.jpg',
    imageAlt: 'Finished concrete commercial building pad, crisp curbs, and paved apron',
    description:
      'We form, reinforce, pour, and finish structural concrete the right way—proper sub-base compaction, full rebar mats, control joints placed on schedule, and clean edges that resist heaving and cracking.',
    specs: [
      { label: 'Concrete Mix', value: '4,000+ PSI Air-Entrained Ready-Mix' },
      { label: 'Reinforcement', value: '#4 / #5 Rebar Grid & Footing Dowels' },
      { label: 'Finishes', value: 'Broom, Hard-Trowel Shop & Exposed' },
      { label: 'Applications', value: 'Homes, Garages, Small Commercial' },
    ],
    deliverables: [
      'Poured stem-wall foundations & thickened-edge slabs',
      'Detached garage, pole-barn & workshop floors',
      'Structural concrete & block retaining walls',
      'Sidewalks, curbs, ADA ramps & driveway aprons',
    ],
    estimatorKey: 'concrete',
  },
  drainage: {
    code: '03 / DRAINAGE & UNDERGROUND UTILITIES',
    title: 'Stormwater Drainage, Culverts & Utility Trenching',
    image: 'assets/project-drainage.jpg',
    imageAlt: 'Poured concrete stormwater retention structure and drainage basin',
    description:
      'Standing water ruins foundations and washes out driveways. We solve stubborn property drainage problems and install water, sewer, storm, and power conduits cleanly with minimal lawn disruption.',
    specs: [
      { label: 'Pipe & Culverts', value: 'HDPE, SDR-35, Ductile Iron & RCP' },
      { label: 'Drainage Design', value: 'Laser-Sloped Gravity Flow Checks' },
      { label: 'Trench Safety', value: 'OSHA Shoring & Bedded Gravel Backfill' },
      { label: 'Inspections', value: 'County & Township Sign-Off Ready' },
    ],
    deliverables: [
      'Water main, sewer lateral & conduit trenching',
      'Driveway culverts, headwalls & ditch reshaping',
      'French drains, catch basins & downspout tie-ins',
      'Small commercial detention & stormwater basins',
    ],
    estimatorKey: 'drainage',
  },
  roadways: {
    code: '04 / DRIVEWAYS & ACCESS ROADS',
    title: 'Driveways, Rural Access Roads & Small Commercial Lots',
    image: 'assets/project-roadway.jpg',
    imageAlt: 'Freshly paved access road with graded green embankments and concrete abutment',
    description:
      'A road or driveway only lasts as long as the stone base underneath it. We strip soft organic soil, lay geotextile fabric where needed, compact crushed aggregate in lifts, and finish in gravel or hot-mix asphalt.',
    specs: [
      { label: 'Sub-Base Build', value: 'Geotextile Fabric + 6–10 in. Crushed Base' },
      { label: 'Surface Options', value: 'Crushed Gravel, Chip Seal & Asphalt' },
      { label: 'Compaction', value: 'Vibratory Roller in Compacted Lifts' },
      { label: 'Drainage Crown', value: '2% Cross-Slope & Swale Runoff' },
    ],
    deliverables: [
      'Long residential & rural farm access roads',
      'New asphalt driveways & resurfacing prep',
      'Small business parking pads & loading aprons',
      'Washout repair, ditching & gravel re-grading',
    ],
    estimatorKey: 'roadways',
  },
};

const RESIDENTIAL_PROJECTS = [
  {
    id: 'res-01-alder-creek',
    title: 'Alder Creek Custom Home Site Prep & Foundation Dig',
    category: 'residential',
    categoryLabel: 'Residential',
    serviceSector: 'Site & Grading',
    location: 'Cedar Valley',
    year: '2026',
    client: 'Private Homeowner',
    value: '$48,500',
    duration: '2 Weeks',
    volume: '2.2 Acres',
    safety: 'Passed County Grade Check',
    image: 'assets/res-grading.jpg',
    imageAlt: 'Excavators grading and preparing a residential home site pad',
    summary:
      'Cleared a wooded 2.2-acre hillside parcel, cut a 320-foot gravel access drive, excavated a full walkout basement, and installed perimeter footing drains ahead of framing.',
    highlights: [
      'Walked the lot with the homeowners to preserve 14 mature fir trees along the entry drive.',
      'Stripped and stockpiled clean topsoil on-site so the family avoided buying fill dirt.',
      'Compacted building pad passed geotechnical density testing on the first visit.',
    ],
  },
  {
    id: 'res-02-oak-hollow-drive',
    title: 'Oak Hollow Hillside Driveway & Retaining Wall',
    category: 'residential',
    categoryLabel: 'Residential',
    serviceSector: 'Roads & Access',
    location: 'Oak Hollow Ridge',
    year: '2026',
    client: 'Oak Hollow Residents',
    value: '$64,000',
    duration: '3 Weeks',
    volume: '680 Linear Ft',
    safety: '5-Year Base Guarantee',
    image: 'assets/res-driveway.jpg',
    imageAlt: 'Curving paved residential access road with concrete retaining wall and green slopes',
    summary:
      'Rebuilt a washed-out hillside residential driveway with a cast-in-place concrete retaining wall, roadside drainage ditches, woven geotextile fabric, and fresh asphalt.',
    highlights: [
      'Stabilized soft clay sub-grade with 8 inches of compacted crushed rock.',
      'Installed two heavy-wall 18-inch HDPE driveway culverts with stone rip-rap.',
      'Hydroseeded disturbed lawn edges with native slope-stabilizing grass.',
    ],
  },
  {
    id: 'res-03-willow-barn-slab',
    title: 'Willow Lane Detached Garage & Pole-Barn Slab',
    category: 'residential',
    categoryLabel: 'Residential',
    serviceSector: 'Concrete',
    location: 'Brookside',
    year: '2025',
    client: 'Private Homeowner',
    value: '$29,800',
    duration: '1 Week',
    volume: '2,400 sq ft',
    safety: '4,000 PSI Air-Entrained',
    image: 'assets/res-concrete.jpg',
    imageAlt: 'Finished residential concrete slab apron and crisp site curbing',
    summary:
      'Formed and poured a thickened-edge 6-inch reinforced concrete workshop floor, exterior apron, and French drain stub-outs for a residential 40×60 detached garage.',
    highlights: [
      'Full #4 rebar mat on 16-inch centers with vapor barrier over compacted gravel.',
      'Hard-troweled interior floor with same-day saw-cut control joints.',
      'Broom-finished exterior apron sloped cleanly away from overhead doors.',
    ],
  },
  {
    id: 'res-04-meadow-drainage',
    title: 'Meadowbrook Backyard Stormwater & French Drain',
    category: 'residential',
    categoryLabel: 'Residential',
    serviceSector: 'Drainage & Utilities',
    location: 'Meadowbrook',
    year: '2025',
    client: 'Private Homeowner',
    value: '$16,400',
    duration: '4 Days',
    volume: '340 Linear Ft',
    safety: 'Dry Basement Verified',
    image: 'assets/res-grading.jpg',
    imageAlt: 'Residential drainage trenching and backyard grading equipment',
    summary:
      'Eliminated seasonal standing water around a split-level home by re-grading perimeter slopes and installing 340 feet of perforated curtain drain, catch basins, and daylight outfall.',
    highlights: [
      'Laser-verified 1.5% gravity fall across all downspout and curtain-drain runs.',
      'Wrapped clean #57 drainage stone in non-woven filter fabric to prevent silting.',
      'Restored lawn with screened topsoil and grass seed upon completion.',
    ],
  },
  {
    id: 'res-05-pinecrest-foundation',
    title: 'Pinecrest Custom Stem-Wall Foundation & Utilities',
    category: 'residential',
    categoryLabel: 'Residential',
    serviceSector: 'Concrete',
    location: 'Pinecrest Hills',
    year: '2025',
    client: 'Hartman Family Build',
    value: '$54,200',
    duration: '2 Weeks',
    volume: '3,100 sq ft',
    safety: 'Passed Structural Inspect',
    image: 'assets/res-concrete.jpg',
    imageAlt: 'Residential concrete foundation pad and curbed site entrance',
    summary:
      'Excavated footings, poured continuous reinforced concrete stem walls, and trenched 240 feet of shared water, sewer, and underground power conduit for a new family residence.',
    highlights: [
      'Coordinated 811 locates and county footing inspections with zero schedule holds.',
      'Applied damp-proofing membrane and perimeter drain tile prior to gravel backfill.',
      'Delivered ready-to-frame foundation within 1/8-inch diagonal squareness.',
    ],
  },
  {
    id: 'res-06-birch-culvert',
    title: 'Birch Creek Driveway Culvert & Gravel Approach',
    category: 'residential',
    categoryLabel: 'Residential',
    serviceSector: 'Drainage & Utilities',
    location: 'Birch Creek Rd',
    year: '2025',
    client: 'Private Homeowner',
    value: '$18,900',
    duration: '5 Days',
    volume: '260 Linear Ft',
    safety: 'County Road Approved',
    image: 'assets/res-driveway.jpg',
    imageAlt: 'Graded residential road approach with reinforced slope and drainage',
    summary:
      'Replaced a collapsed creek-crossing culvert with dual 24-inch reinforced concrete pipes, poured concrete headwalls, and crowned 260 feet of crushed limestone driveway.',
    highlights: [
      'Engineered to carry full fire-truck and concrete-mixer axle loads safely.',
      'Armored upstream and downstream banks with angular quarry rip-rap.',
      'Completed while maintaining temporary pedestrian access for the family.',
    ],
  },
  {
    id: 'res-07-sycamore-pad',
    title: 'Sycamore Acreage Clearing & ADU Building Pad',
    category: 'residential',
    categoryLabel: 'Residential',
    serviceSector: 'Site & Grading',
    location: 'West Brookside',
    year: '2024',
    client: 'Private Homeowner',
    value: '$31,500',
    duration: '1 Week',
    volume: '1.1 Acres',
    safety: 'Zero Tree Damage',
    image: 'assets/res-grading.jpg',
    imageAlt: 'Site clearing and pad grading for residential backyard unit',
    summary:
      'Cleared brush and stumps, leveled a structural building pad for an in-law accessory dwelling unit, and tied new water and sewer laterals into existing household utilities.',
    highlights: [
      'Protected adjacent septic drain field with staked exclusion fencing.',
      'Compacted structural fill in 8-inch lifts with vibratory roller.',
      'Left yard swept and driveway washed before final walk-through.',
    ],
  },
  {
    id: 'res-08-riverbend-wall',
    title: 'Riverbend Terrace Retaining Wall & Patio Slab',
    category: 'residential',
    categoryLabel: 'Residential',
    serviceSector: 'Concrete',
    location: 'Riverbend',
    year: '2024',
    client: 'Private Homeowner',
    value: '$39,400',
    duration: '2 Weeks',
    volume: '1,450 sq ft',
    safety: 'Engineered Geogrid',
    image: 'assets/res-concrete.jpg',
    imageAlt: 'Architectural residential concrete retaining work and flatwork apron',
    summary:
      'Built a 95-foot structural concrete retaining wall with weep drainage to reclaim a sloped backyard and poured an adjoining broom-finished patio and walkway.',
    highlights: [
      'Installed crushed-stone drainage chimney and perforated heel pipe behind wall.',
      'Matched existing architectural curb lines and clean chamfered wall edges.',
      'Finished ahead of the family’s autumn landscaping schedule.',
    ],
  },
  {
    id: 'res-09-clover-septic-prep',
    title: 'Clover Ridge Septic Field & Utility Trenching',
    category: 'residential',
    categoryLabel: 'Residential',
    serviceSector: 'Drainage & Utilities',
    location: 'Clover Ridge',
    year: '2024',
    client: 'Private Homeowner',
    value: '$24,600',
    duration: '1 Week',
    volume: '410 Linear Ft',
    safety: 'Health Dept Signed Off',
    image: 'assets/res-grading.jpg',
    imageAlt: 'Residential utility trenching and earthworks preparation',
    summary:
      'Prepared level perc-tested drainfield trenches, set precast septic and pump tanks, and ran bedded water and electrical conduits to a new rural homesite.',
    highlights: [
      'Followed county sanitarian specs using washed drainage aggregate.',
      'Used low-ground-pressure excavator tracks to avoid compacting native perc soils.',
      'Passed final county health inspection on the first check.',
    ],
  },
  {
    id: 'res-10-hawthorne-drive',
    title: 'Hawthorne Lane Asphalt Driveway & Apron Rebuild',
    category: 'residential',
    categoryLabel: 'Residential',
    serviceSector: 'Roads & Access',
    location: 'Hawthorne Estates',
    year: '2024',
    client: 'Private Homeowner',
    value: '$27,200',
    duration: '5 Days',
    volume: '380 Linear Ft',
    safety: '2% Runoff Crown',
    image: 'assets/res-driveway.jpg',
    imageAlt: 'Freshly paved curving residential driveway and landscaped shoulder',
    summary:
      'Removed alligator-cracked old pavement, dug out soft clay pockets, laid 6 inches of compacted dense-grade base, and finished with 3 inches of hot-mix asphalt and concrete apron.',
    highlights: [
      'Added a flared turnaround pad to make trailer backing effortless.',
      'Tapered street transition seamlessly into municipal curb gutter.',
      'Hand-tamped borders cleanly alongside existing stone landscaping.',
    ],
  },
  {
    id: 'res-11-summit-walkout',
    title: 'Summit View Basement Excavation & Footing Drains',
    category: 'residential',
    categoryLabel: 'Residential',
    serviceSector: 'Site & Grading',
    location: 'Summit View',
    year: '2023',
    client: 'Local Custom Builder',
    value: '$36,800',
    duration: '1 Week',
    volume: '1,650 cu yd Cut',
    safety: 'OSHA Bench Slopes',
    image: 'assets/res-grading.jpg',
    imageAlt: 'Deep residential basement excavation and site grading',
    summary:
      'Excavated a 10-foot walkout basement cut on a steep view lot, installed foundation drainage stone and perimeter pipe, and backfilled gently once walls cured.',
    highlights: [
      'Laser-checked footing sub-grade to within half an inch before forms arrived.',
      'Reused clean excavated subsoil to build up the level rear lawn terrace.',
      'Zero wall deflection during staged compacted backfill.',
    ],
  },
  {
    id: 'res-12-maple-court-curb',
    title: 'Maple Court Cul-de-Sac Concrete & Drainage Upgrade',
    category: 'residential',
    categoryLabel: 'Residential',
    serviceSector: 'Concrete',
    location: 'Maple Court',
    year: '2023',
    client: 'Four-Home HOA',
    value: '$44,500',
    duration: '2 Weeks',
    volume: '1,900 sq ft',
    safety: 'ADA Ramp Compliant',
    image: 'assets/res-concrete.jpg',
    imageAlt: 'Fresh residential concrete curbing, paved cul-de-sac apron, and drainage',
    summary:
      'Replaced heaved concrete curbs, driveway aprons, and two collapsed storm inlets across a four-home private residential cul-de-sac.',
    highlights: [
      'Phased pours half-width so every family kept vehicle access each evening.',
      'Upgraded curb inlets with heavy-duty cast-iron bicycle-safe grates.',
      'Sealed all fresh concrete aprons against winter de-icing salt.',
    ],
  },
];

const INDUSTRIAL_SPECS = [
  ['Maple Ridge Equipment Shop Pad & Curbwork', 'Northside Industrial Park', '2026', 'Maple Ridge Ag & Supply', '$112,000', '4 Weeks', '8,400 sq ft', 'Concrete', 'assets/project-concrete.jpg'],
  ['Millbrook Stormwater Retention Basin & Outfall', 'Millbrook Industrial Zone', '2026', 'Millbrook Township Works', '$138,000', '5 Weeks', '420 cu yd', 'Drainage & Utilities', 'assets/project-drainage.jpg'],
  ['Ironworks Heavy Truck Loading Apron & Scale Pit', 'Eastgate Freight Yard', '2026', 'Valley Freight Logistics', '$164,000', '4 Weeks', '12,600 sq ft', 'Concrete', 'assets/project-concrete.jpg'],
  ['Cedar Mill Haul Road & Retaining Abutment', 'Cedar Mill Corridor', '2026', 'Cedar Timber Co.', '$146,000', '4 Weeks', '1,850 Linear Ft', 'Roads & Access', 'assets/project-roadway.jpg'],
  ['Brookside Cold-Storage Warehouse Site Grading', 'Brookside Commerce Park', '2025', 'Cascade Cold Storage', '$185,000', '5 Weeks', '4.8 Acres', 'Site & Grading', 'assets/project-excavation.jpg'],
  ['Northport Process Water Clarifier & Catwalk Pad', 'Northport Utility District', '2025', 'Regional Water Authority', '$215,000', '6 Weeks', '560 cu yd', 'Drainage & Utilities', 'assets/project-drainage.jpg'],
  ['Summit Fabrication Plant Machine Foundations', 'South Industrial Blvd', '2025', 'Summit Steel Fab', '$128,500', '3 Weeks', '6,200 sq ft', 'Concrete', 'assets/project-concrete.jpg'],
  ['Quarry Road Aggregate Scale House & Approach', 'County Route 14', '2025', 'Redrock Aggregates', '$152,000', '4 Weeks', '1,420 Linear Ft', 'Roads & Access', 'assets/project-roadway.jpg'],
  ['Westside Distribution Yard Detention Pond', 'Westside Logistics Park', '2025', 'Pacific Parcel Hub', '$119,000', '4 Weeks', '3.1 Acres', 'Drainage & Utilities', 'assets/project-drainage.jpg'],
  ['Harborline Crane Rail Pad & Deep Excavation', 'Harbor Industrial Spur', '2025', 'Harborline Transload', '$194,000', '5 Weeks', '9,800 sq ft', 'Site & Grading', 'assets/project-excavation.jpg'],
  ['Tri-County Grain Silo Ring-Wall Foundation', 'Agri-Park Way', '2024', 'Valley Grain Co-op', '$142,000', '4 Weeks', '310 cu yd', 'Concrete', 'assets/project-concrete.jpg'],
  ['Riverside Fuel Depot Containment Pad & Trenching', 'Riverfront Industrial', '2024', 'Mid-Valley Fuels', '$168,000', '5 Weeks', '7,400 sq ft', 'Drainage & Utilities', 'assets/project-drainage.jpg'],
  ['Midway Industrial Park Collector Road Rebuild', 'Midway Tech & Yard', '2024', 'Midway Park Owners', '$208,000', '6 Weeks', '2,400 Linear Ft', 'Roads & Access', 'assets/project-roadway.jpg'],
  ['Precision Tooling Expansion Pad & Dock Levelers', 'Commerce Loop', '2024', 'Precision CNC Corp.', '$134,000', '4 Weeks', '10,200 sq ft', 'Concrete', 'assets/project-concrete.jpg'],
  ['Clearcreek Bottling Plant Wastewater Basin', 'Clearcreek Ind. Park', '2024', 'Clearcreek Beverages', '$176,000', '5 Weeks', '480 cu yd', 'Drainage & Utilities', 'assets/project-drainage.jpg'],
  ['Timberline Lumber Yard Mass Grading & Swales', 'Highway 9 Yard', '2024', 'Timberline Wholesale', '$158,000', '4 Weeks', '5.5 Acres', 'Site & Grading', 'assets/project-excavation.jpg'],
  ['Oakridge Fleet Maintenance Shop Floor & Oil Interceptor', 'Oakridge Depot', '2023', 'County Transit Fleet', '$149,000', '4 Weeks', '7,800 sq ft', 'Concrete', 'assets/project-concrete.jpg'],
  ['Alder Industrial Fire-Main Loop & Hydrant Trenching', 'Alder Business Park', '2023', 'Alder Industrial Dev.', '$124,000', '3 Weeks', '1,680 Linear Ft', 'Drainage & Utilities', 'assets/project-drainage.jpg'],
  ['Valley Concrete Batch Plant Yard Paving & Curbs', 'Mill Road Spur', '2023', 'Valley Ready-Mix', '$172,000', '4 Weeks', '14,500 sq ft', 'Roads & Access', 'assets/project-roadway.jpg'],
  ['Greenway Recycling Transfer Station Tipping Floor', 'Greenway Ind. Zone', '2023', 'Greenway Recovery', '$198,000', '5 Weeks', '11,000 sq ft', 'Concrete', 'assets/project-concrete.jpg'],
  ['Northbend Substation Gravel Pad & Grounding Grid', 'Northbend Utility Rd', '2023', 'Local Power Co-op', '$136,000', '4 Weeks', '2.8 Acres', 'Site & Grading', 'assets/project-excavation.jpg'],
  ['Parkway Cold-Chain Truck Turnaround & Culvert', 'Parkway Freight Ln', '2022', 'Northwest Produce', '$144,000', '4 Weeks', '1,250 Linear Ft', 'Roads & Access', 'assets/project-roadway.jpg'],
  ['Metalworks Press Pit & Structural Mat Foundation', 'Foundry Drive', '2022', 'Cascade Metalworks', '$162,000', '4 Weeks', '380 cu yd', 'Concrete', 'assets/project-concrete.jpg'],
  ['Eastside Industrial Park Sanitary Lift Station', 'Eastside Commerce', '2022', 'Brookside Sewer Dist.', '$188,000', '6 Weeks', '28 ft Deep Cut', 'Drainage & Utilities', 'assets/project-drainage.jpg'],
  ['Railspur Bulk Transfer Pad & Perimeter Retaining Wall', 'Old Rail Yard', '2022', 'Inland Bulk Terminals', '$174,000', '5 Weeks', '3.6 Acres', 'Site & Grading', 'assets/project-excavation.jpg'],
  ['Heritage Foundry Stormwater Filter Vaults', 'Foundry Way', '2021', 'Heritage Castings', '$129,000', '4 Weeks', '920 Linear Ft', 'Drainage & Utilities', 'assets/project-drainage.jpg'],
  ['Brookside Heavy Equipment Rental Yard & Wash Bay', 'County Mill Rd', '2021', 'Regional Rentals LLC', '$154,000', '4 Weeks', '13,200 sq ft', 'Roads & Access', 'assets/project-roadway.jpg'],
];

const INDUSTRIAL_PROJECTS = INDUSTRIAL_SPECS.map((spec, idx) => {
  const [title, location, year, client, value, duration, volume, serviceSector, image] = spec;
  const num = String(idx + 1).padStart(2, '0');
  return {
    id: `ind-${num}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 22)}`,
    title,
    category: 'industrial',
    categoryLabel: 'Industrial',
    serviceSector,
    location,
    year,
    client,
    value,
    duration,
    volume,
    safety: 'Zero Lost-Time Incidents',
    image,
    imageAlt: `${title} completed industrial civil construction project`,
    summary: `Turnkey industrial ${serviceSector.toLowerCase()} execution for ${client} at ${location}, delivered on schedule with owner-supervised QA/QC, heavy-load compaction, and full site cleanup.`,
    highlights: [
      `Self-performed ${volume} scope with our in-house excavation, concrete, and utility crew.`,
      'Passed all third-party compaction, concrete strength, and municipal inspection checkpoints.',
      'Phased heavy equipment access to keep adjacent industrial operations moving safely.',
    ],
  };
});

// Interleave residential (12) and industrial (27) projects cleanly for the "All" view
const PROJECTS = [];
for (let i = 0; i < Math.max(RESIDENTIAL_PROJECTS.length, INDUSTRIAL_PROJECTS.length); i += 1) {
  if (RESIDENTIAL_PROJECTS[i]) PROJECTS.push(RESIDENTIAL_PROJECTS[i]);
  if (INDUSTRIAL_PROJECTS[i]) PROJECTS.push(INDUSTRIAL_PROJECTS[i]);
}

/* Realistic Ballpark Unit Rates for a Small Family-Owned Civil Contractor */
const ESTIMATOR_CONFIG = {
  excavation: {
    label: 'Site Prep & Excavation',
    unit: 'Acres',
    min: 0.25,
    max: 6,
    step: 0.25,
    defaultVal: 1.0,
    baseCostLow: 8500,
    baseCostHigh: 14500,
    fixedMob: 2200,
    daysPerUnit: 3.5,
    baseDays: 2,
    crew: '20-Ton Excavator, Skid Steer, 10-Yard Dump Truck & Owner Foreman',
  },
  concrete: {
    label: 'Concrete, Slabs & Foundations',
    unit: 'sq ft',
    min: 400,
    max: 6000,
    step: 200,
    defaultVal: 1600,
    baseCostLow: 13,
    baseCostHigh: 21,
    fixedMob: 1800,
    daysPerUnit: 0.0032,
    baseDays: 3,
    crew: 'Concrete Form Crew, Laser Screed, Rebar Rig & Ready-Mix Pump',
  },
  drainage: {
    label: 'Drainage, Culverts & Utilities',
    unit: 'Linear Ft',
    min: 50,
    max: 800,
    step: 25,
    defaultVal: 200,
    baseCostLow: 42,
    baseCostHigh: 72,
    fixedMob: 1900,
    daysPerUnit: 0.024,
    baseDays: 2,
    crew: 'Mini/Mid Excavator, Trench Compactor, Pipe Laser & Utility Crew',
  },
  roadways: {
    label: 'Driveways & Private Roads',
    unit: 'Linear Ft',
    min: 50,
    max: 1200,
    step: 50,
    defaultVal: 250,
    baseCostLow: 48,
    baseCostHigh: 84,
    fixedMob: 2500,
    daysPerUnit: 0.016,
    baseDays: 2,
    crew: 'Motor Grader / Skid Steer, Vibratory Roller, Dump Truck & Paving Crew',
  },
};

const SITE_MULTIPLIERS = {
  flat: { label: 'Flat / Easy Access', factor: 1.0, timeFactor: 1.0 },
  sloped: { label: 'Sloped or Wooded Lot', factor: 1.25, timeFactor: 1.25 },
  rocky: { label: 'Rocky / Wet Ground', factor: 1.45, timeFactor: 1.4 },
};

const SCHEDULE_FACTORS = {
  standard: { label: 'Standard Schedule', factor: 1.0, daysDelta: 0 },
  priority: { label: 'Priority Window', factor: 1.06, daysDelta: -1 },
  urgent: { label: 'Urgent / Storm Repair', factor: 1.12, daysDelta: -2 },
};

/* ==========================================================================
   DOM Helpers & Initialization
   ========================================================================== */

function bootApp() {
  const initializers = [
    initHeaderAndNav,
    initMetricsCounters,
    initServices,
    initPortfolio,
    initEstimator,
    initQuoteForm,
    initScrollReveal,
  ];
  initializers.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`Initialization error in ${fn.name}:`, err);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}

function formatCurrency(value) {
  const rounded = Math.round(value / 100) * 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(rounded);
}

function formatDuration(days) {
  const safeDays = Math.max(2, Math.round(days));
  if (safeDays <= 6) {
    return `${Math.max(2, safeDays - 1)} – ${safeDays + 1} Days`;
  }
  const minWeeks = Math.max(1, Math.floor(safeDays / 5));
  const maxWeeks = Math.max(minWeeks + 1, Math.ceil((safeDays + 3) / 5));
  return `${minWeeks} – ${maxWeeks} Weeks`;
}

function formatQuantity(val, unit) {
  if (unit === 'sq ft' || unit === 'Linear Ft') {
    return `${Number(val).toLocaleString('en-US')} ${unit}`;
  }
  return `${val} ${unit}`;
}

/* ==========================================================================
   Header, Scroll State & Mobile Navigation
   ========================================================================== */

function initHeaderAndNav() {
  const header = document.getElementById('site-header');
  const toggleBtn = document.getElementById('nav-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const drawerLinks = drawer ? drawer.querySelectorAll('a') : [];
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 36);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  const setDrawerOpen = (isOpen) => {
    if (!drawer || !toggleBtn) return;
    drawer.classList.toggle('is-open', isOpen);
    drawer.setAttribute('aria-hidden', String(!isOpen));
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (toggleBtn) toggleBtn.addEventListener('click', () => setDrawerOpen(true));
  if (closeBtn) closeBtn.addEventListener('click', () => setDrawerOpen(false));
  drawerLinks.forEach((link) => link.addEventListener('click', () => setDrawerOpen(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      setDrawerOpen(false);
    }
  });

  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === id));
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    sections.forEach((sec) => observer.observe(sec));
  }
}

/* ==========================================================================
   Animated Hero Performance Metrics
   ========================================================================== */

function initMetricsCounters() {
  const counters = document.querySelectorAll('[data-count-target]');
  if (!counters.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.countTarget);
    const decimals = parseInt(el.dataset.countDecimals || '0', 10);
    const prefix = el.dataset.countPrefix || '';

    if (prefersReduced) {
      el.textContent = `${prefix}${target.toFixed(decimals)}`;
      return;
    }

    const duration = 850;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = `${prefix}${current.toFixed(decimals)}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${prefix}${target.toFixed(decimals)}`;
      }
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => observer.observe(c));
  } else {
    counters.forEach(animateCounter);
  }
}

/* ==========================================================================
   Interactive Services Ledger
   ========================================================================== */

function initServices() {
  const tabs = document.querySelectorAll('.discipline-tab');
  const panelImage = document.getElementById('discipline-image');
  const panelCode = document.getElementById('discipline-code');
  const panelTitle = document.getElementById('discipline-title');
  const panelDesc = document.getElementById('discipline-desc');
  const panelSpecs = document.getElementById('discipline-specs');
  const panelDeliverables = document.getElementById('discipline-deliverables');
  const panelEstimateBtn = document.getElementById('discipline-estimate-btn');

  if (!tabs.length || !panelTitle) return;

  let activeServiceKey = 'excavation';

  const renderService = (key) => {
    const data = SERVICES[key];
    if (!data) return;
    activeServiceKey = key;

    tabs.forEach((tab) => {
      const selected = tab.dataset.discipline === key;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });

    panelImage.src = data.image;
    panelImage.alt = data.imageAlt;
    panelCode.textContent = data.code;
    panelTitle.textContent = data.title;
    panelDesc.textContent = data.description;

    panelSpecs.innerHTML = data.specs
      .map(
        (s) => `
          <div>
            <div class="discipline-spec__label">${s.label}</div>
            <div class="discipline-spec__value">${s.value}</div>
          </div>
        `
      )
      .join('');

    panelDeliverables.innerHTML = data.deliverables.map((item) => `<li>${item}</li>`).join('');
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => renderService(tab.dataset.discipline));
  });

  if (panelEstimateBtn) {
    panelEstimateBtn.addEventListener('click', () => {
      const estKey = SERVICES[activeServiceKey]?.estimatorKey || 'excavation';
      const targetBtn = document.querySelector(`[data-est-type="${estKey}"]`);
      if (targetBtn) targetBtn.click();
      document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  renderService('excavation');
}

/* ==========================================================================
   Filterable Local Work Portfolio & Project Modal
   ========================================================================== */

function initPortfolio() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('projects-grid');
  const countEl = document.getElementById('portfolio-count');
  const actionsWrap = document.getElementById('portfolio-actions');
  const loadMoreBtn = document.getElementById('portfolio-load-more');
  const showAllBtn = document.getElementById('portfolio-show-all');
  const modalBackdrop = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');

  if (!grid) return;

  const PAGE_SIZE = 6;
  let activeFilter = 'all';
  let visibleLimit = PAGE_SIZE;

  const getFilteredProjects = () => {
    if (activeFilter === 'residential') return RESIDENTIAL_PROJECTS;
    if (activeFilter === 'industrial') return INDUSTRIAL_PROJECTS;
    return PROJECTS;
  };

  const renderPortfolio = () => {
    const matching = getFilteredProjects();
    const slice = matching.slice(0, visibleLimit);

    grid.innerHTML = slice
      .map(
        (p) => `
          <article class="project-card" data-category="${p.category}">
            <div class="project-card__media">
              <img src="${p.image}" alt="${p.imageAlt}" loading="lazy" />
              <span class="project-card__sector project-card__sector--${p.category}">
                ${p.categoryLabel} &bull; ${p.serviceSector}
              </span>
              <span class="project-card__status">Completed</span>
            </div>
            <div class="project-card__body">
              <div class="project-card__meta">
                <span>${p.location}</span>
                <span>${p.year}</span>
              </div>
              <h3 class="project-card__title">${p.title}</h3>
              <p class="project-card__summary">${p.summary}</p>
              <div class="project-card__stats">
                <div>
                  <span class="project-stat__label">Project Cost</span>
                  <span class="project-stat__val">${p.value}</span>
                </div>
                <div>
                  <span class="project-stat__label">Size</span>
                  <span class="project-stat__val">${p.volume}</span>
                </div>
                <div>
                  <span class="project-stat__label">Timeframe</span>
                  <span class="project-stat__val">${p.duration}</span>
                </div>
              </div>
              <button
                type="button"
                class="project-card__cta"
                data-open-project="${p.id}"
                id="btn-project-${p.id}"
              >
                <span>View Project Details</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </article>
        `
      )
      .join('');

    filterBtns.forEach((btn) => {
      const active = btn.dataset.filter === activeFilter;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    if (countEl) {
      const label =
        activeFilter === 'residential'
          ? 'RESIDENTIAL PROJECTS'
          : activeFilter === 'industrial'
            ? 'INDUSTRIAL PROJECTS'
            : 'COMPLETED PROJECTS';
      countEl.textContent = `SHOWING ${slice.length} OF ${matching.length} ${label}`;
    }

    const remaining = matching.length - slice.length;
    if (actionsWrap) {
      actionsWrap.classList.toggle('is-hidden', remaining <= 0);
    }
    if (loadMoreBtn && remaining > 0) {
      const nextStep = Math.min(PAGE_SIZE, remaining);
      loadMoreBtn.textContent = `Load ${nextStep} More (${remaining} Remaining)`;
    }
    if (showAllBtn && remaining > 0) {
      showAllBtn.textContent = `Show All ${matching.length}`;
    }
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      visibleLimit = PAGE_SIZE;
      renderPortfolio();
    });
  });

  loadMoreBtn?.addEventListener('click', () => {
    visibleLimit += PAGE_SIZE;
    renderPortfolio();
  });

  showAllBtn?.addEventListener('click', () => {
    visibleLimit = getFilteredProjects().length;
    renderPortfolio();
  });

  let lastFocusedTrigger = null;

  const openModal = (projectId, triggerEl) => {
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project || !modalBackdrop) return;
    lastFocusedTrigger = triggerEl || null;

    document.getElementById('modal-sector').textContent =
      `${project.categoryLabel.toUpperCase()} — ${project.serviceSector.toUpperCase()} (${project.year})`;
    document.getElementById('modal-img').src = project.image;
    document.getElementById('modal-img').alt = project.imageAlt;
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-summary').textContent = project.summary;
    document.getElementById('modal-client').textContent = project.client;
    document.getElementById('modal-value').textContent = project.value;
    document.getElementById('modal-volume').textContent = project.volume;
    document.getElementById('modal-safety').textContent = project.safety;
    document.getElementById('modal-highlights').innerHTML = project.highlights
      .map((item) => `<li>${item}</li>`)
      .join('');

    const inquireBtn = document.getElementById('modal-inquire-btn');
    if (inquireBtn) {
      inquireBtn.onclick = () => {
        closeModal();
        const notes = document.getElementById('rfp-notes');
        const sectorSelect = document.getElementById('rfp-sector');
        if (sectorSelect) {
          sectorSelect.value = project.serviceSector;
          sectorSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (notes && !notes.value.trim()) {
          notes.value = `Looking for a free estimate on a ${project.categoryLabel.toLowerCase()} project similar to "${project.title}" (${project.volume}).`;
          notes.dispatchEvent(new Event('input', { bubbles: true }));
        }
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      };
    }

    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  };

  const closeModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedTrigger) lastFocusedTrigger.focus();
  };

  grid.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-open-project]');
    if (btn) openModal(btn.dataset.openProject, btn);
  });

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalBackdrop?.classList.contains('is-open')) {
      closeModal();
    }
  });

  renderPortfolio();
}

/* ==========================================================================
   Interactive Ballpark Project Estimator
   ========================================================================== */

let latestEstimateSummary = '';

function initEstimator() {
  const typeBtns = document.querySelectorAll('[data-est-type]');
  const siteBtns = document.querySelectorAll('[data-est-site]');
  const scheduleBtns = document.querySelectorAll('[data-est-delivery]');
  const scaleSlider = document.getElementById('est-scale-slider');
  const scaleLabel = document.getElementById('est-scale-label');
  const scaleReadout = document.getElementById('est-scale-readout');
  const scaleMin = document.getElementById('est-scale-min');
  const scaleMax = document.getElementById('est-scale-max');
  const attachBtn = document.getElementById('est-attach-btn');

  if (!scaleSlider) return;

  const state = {
    type: 'excavation',
    scale: ESTIMATOR_CONFIG.excavation.defaultVal,
    site: 'flat',
    schedule: 'standard',
  };

  const syncSliderToType = (typeKey) => {
    const cfg = ESTIMATOR_CONFIG[typeKey];
    scaleSlider.min = cfg.min;
    scaleSlider.max = cfg.max;
    scaleSlider.step = cfg.step;
    scaleSlider.value = cfg.defaultVal;
    state.scale = cfg.defaultVal;

    scaleLabel.textContent = `2. Approximate Size (${cfg.unit})`;
    scaleMin.textContent = formatQuantity(cfg.min, cfg.unit);
    scaleMax.textContent = formatQuantity(cfg.max, cfg.unit);
  };

  const calculateAndRender = () => {
    const cfg = ESTIMATOR_CONFIG[state.type];
    const site = SITE_MULTIPLIERS[state.site];
    const sched = SCHEDULE_FACTORS[state.schedule];

    const scaleRatio = (state.scale - cfg.min) / Math.max(0.01, cfg.max - cfg.min);
    const efficiency = 1 - scaleRatio * 0.1;

    const totalLow =
      (cfg.fixedMob + state.scale * cfg.baseCostLow * efficiency) * site.factor * sched.factor;
    const totalHigh =
      (cfg.fixedMob + state.scale * cfg.baseCostHigh * efficiency) * site.factor * sched.factor;

    const rawDays =
      (cfg.baseDays + state.scale * cfg.daysPerUnit) * site.timeFactor + sched.daysDelta;

    const qtyText = formatQuantity(state.scale, cfg.unit);
    const rangeText = `${formatCurrency(totalLow)} – ${formatCurrency(totalHigh)}`;
    const durationText = formatDuration(rawDays);

    scaleReadout.textContent = qtyText;
    document.getElementById('est-cost-range').textContent = rangeText;
    document.getElementById('est-discipline-out').textContent = cfg.label;
    document.getElementById('est-scope-out').textContent = qtyText;
    document.getElementById('est-site-out').textContent = site.label;
    document.getElementById('est-delivery-out').textContent = sched.label;
    document.getElementById('est-schedule-out').textContent = durationText;
    document.getElementById('est-fleet-out').textContent = cfg.crew;

    latestEstimateSummary = `${cfg.label} | ${qtyText} | ${site.label} | Ballpark: ${rangeText} (${durationText})`;
  };

  typeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.type = btn.dataset.estType;
      typeBtns.forEach((b) => b.classList.toggle('is-selected', b === btn));
      syncSliderToType(state.type);
      calculateAndRender();
    });
  });

  siteBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.site = btn.dataset.estSite;
      siteBtns.forEach((b) => b.classList.toggle('is-selected', b === btn));
      calculateAndRender();
    });
  });

  scheduleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.schedule = btn.dataset.estDelivery;
      scheduleBtns.forEach((b) => b.classList.toggle('is-selected', b === btn));
      calculateAndRender();
    });
  });

  scaleSlider.addEventListener('input', () => {
    state.scale = Number(scaleSlider.value);
    calculateAndRender();
  });

  if (attachBtn) {
    attachBtn.addEventListener('click', () => {
      const pill = document.getElementById('attached-estimate-pill');
      const pillText = document.getElementById('attached-estimate-text');
      const hiddenInput = document.getElementById('rfp-estimate-summary');
      const sectorSelect = document.getElementById('rfp-sector');
      const notesField = document.getElementById('rfp-notes');

      if (pill && pillText && hiddenInput) {
        pillText.textContent = `Attached Ballpark: ${latestEstimateSummary}`;
        hiddenInput.value = latestEstimateSummary;
        pill.classList.add('is-visible');
      }

      const sectorMap = {
        excavation: 'Site & Grading',
        concrete: 'Concrete',
        drainage: 'Drainage & Utilities',
        roadways: 'Roads & Access',
      };
      if (sectorSelect && sectorMap[state.type]) {
        sectorSelect.value = sectorMap[state.type];
        sectorSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (notesField && !notesField.value.trim()) {
        notesField.value = `Attached from the online estimator: ${latestEstimateSummary}. Would love to schedule a free walk-through on our property.`;
        notesField.dispatchEvent(new Event('input', { bubbles: true }));
      }

      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('rfp-name')?.focus({ preventScroll: true });
    });
  }

  syncSliderToType(state.type);
  calculateAndRender();
}

/* ==========================================================================
   Active Quote Form, Criteria Validation & License / Email Opt-In Modal
   ========================================================================== */

function initQuoteForm() {
  const form = document.getElementById('rfp-form');
  const formFieldsWrap = document.getElementById('rfp-fields-wrap');
  const confirmation = document.getElementById('rfp-confirmation');
  const confirmMeta = document.getElementById('rfp-confirmation-meta');
  const resetBtn = document.getElementById('rfp-reset-btn');
  const clearEstimateBtn = document.getElementById('clear-estimate-btn');
  const submitBtn = document.getElementById('rfp-submit');
  const submitLabel = document.getElementById('rfp-submit-label');
  const alertBox = document.getElementById('rfp-form-alert');
  const notesInput = document.getElementById('rfp-notes');
  const notesCounter = document.getElementById('rfp-notes-counter');
  const criteriaBar = document.getElementById('form-criteria-bar');
  const criteriaText = document.getElementById('form-criteria-text');
  const licenseCheckbox = document.getElementById('rfp-license-agree');
  const emailOptInCheckbox = document.getElementById('rfp-email-optin');

  if (!form) return;

  initLicenseModal(licenseCheckbox, emailOptInCheckbox, () => {
    validateField(licenseCheckbox, true);
    updateCriteriaProgress();
  });

  clearEstimateBtn?.addEventListener('click', () => {
    document.getElementById('attached-estimate-pill')?.classList.remove('is-visible');
    const hiddenInput = document.getElementById('rfp-estimate-summary');
    if (hiddenInput) hiddenInput.value = '';
  });

  const checkCriterion = (input) => {
    if (!input) return true;
    if (input.type === 'checkbox') {
      return input.hasAttribute('required') ? input.checked : true;
    }

    const val = input.value.trim();
    if (input.id === 'rfp-name') return val.length >= 2;
    if (input.id === 'rfp-email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
    if (input.id === 'rfp-phone') {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 15;
    }
    if (input.id === 'rfp-notes') return val.length >= 20;
    if (input.hasAttribute('required')) return Boolean(val);
    return true;
  };

  const validateField = (input, showError = true) => {
    const wrapper = input.closest('.field, .checkbox-field');
    if (!wrapper) return true;
    const valid = checkCriterion(input);

    if (showError) {
      wrapper.classList.toggle('has-error', !valid);
    }
    if (wrapper.classList.contains('field') && input.hasAttribute('required')) {
      wrapper.classList.toggle('is-valid', valid);
    }
    return valid;
  };

  const requiredElements = Array.from(form.querySelectorAll('[required]'));

  const updateNotesCounter = () => {
    if (!notesInput || !notesCounter) return;
    const len = notesInput.value.trim().length;
    const met = len >= 20;
    notesCounter.textContent = met ? `${len} chars — good` : `${len} / 20 min chars`;
    notesCounter.classList.toggle('is-met', met);
  };

  const updateCriteriaProgress = () => {
    if (!criteriaBar || !criteriaText) return;
    const total = requiredElements.length;
    const met = requiredElements.filter((el) => checkCriterion(el)).length;
    const ready = met === total;
    criteriaBar.classList.toggle('is-ready', ready);
    criteriaText.textContent = ready
      ? `ALL ${total} REQUIRED CRITERIA MET — READY TO SUBMIT`
      : `${met} OF ${total} REQUIRED CRITERIA MET`;
  };

  const showAlert = (msg) => {
    if (!alertBox) return;
    if (!msg) {
      alertBox.textContent = '';
      alertBox.classList.remove('is-visible');
      return;
    }
    alertBox.textContent = msg;
    alertBox.classList.add('is-visible');
  };

  form.querySelectorAll('input, select, textarea').forEach((el) => {
    const evt = el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener('blur', () => {
      if (el.hasAttribute('required')) validateField(el, true);
      updateCriteriaProgress();
    });
    el.addEventListener(evt, () => {
      if (el === notesInput) updateNotesCounter();
      const wrapper = el.closest('.field, .checkbox-field');
      if (wrapper?.classList.contains('has-error') || checkCriterion(el)) {
        validateField(el, wrapper?.classList.contains('has-error'));
      }
      updateCriteriaProgress();
      showAlert('');
    });
  });

  updateNotesCounter();
  updateCriteriaProgress();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showAlert('');

    let allValid = true;
    requiredElements.forEach((input) => {
      if (!validateField(input, true)) allValid = false;
    });
    updateCriteriaProgress();

    if (!allValid) {
      const firstInvalid = form.querySelector(
        '.has-error input, .has-error select, .has-error textarea'
      );
      firstInvalid?.focus();
      showAlert('Please complete all required fields and accept the License Agreement above.');
      return;
    }

    const payload = {
      name: document.getElementById('rfp-name').value.trim(),
      organization: document.getElementById('rfp-org').value.trim(),
      email: document.getElementById('rfp-email').value.trim(),
      phone: document.getElementById('rfp-phone').value.trim(),
      sector: document.getElementById('rfp-sector').value,
      budget: document.getElementById('rfp-budget').value,
      notes: document.getElementById('rfp-notes').value.trim(),
      estimateSummary: document.getElementById('rfp-estimate-summary').value,
      website: document.getElementById('rfp-website')?.value || '',
      licenseAccepted: Boolean(licenseCheckbox?.checked),
      emailOptIn: Boolean(emailOptInCheckbox?.checked),
    };

    if (submitBtn) submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Submitting Inquiry...';

    try {
      const response = await fetch(form.getAttribute('action') || '/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.errors && typeof data.errors === 'object') {
          Object.entries(data.errors).forEach(([fieldName, errMsg]) => {
            const wrapper = form.querySelector(`[data-field="${fieldName}"]`);
            if (wrapper) {
              wrapper.classList.add('has-error');
              wrapper.classList.remove('is-valid');
              const errEl = wrapper.querySelector('.field__error');
              if (errEl && typeof errMsg === 'string') errEl.textContent = errMsg;
            }
          });
        }
        showAlert(data.message || 'Could not submit your inquiry. Please check the form and try again.');
        return;
      }

      const refId = data.referenceId || `CC-${new Date().getFullYear()}-0001`;
      const timestamp = data.receivedAt
        ? new Date(data.receivedAt).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })
        : new Date().toLocaleString('en-US');
      const optInStatus = payload.emailOptIn
        ? 'OPTED IN (Email updates & estimate follow-ups authorized)'
        : 'ESTIMATE REPLY ONLY (Not subscribed to seasonal updates)';

      confirmMeta.innerHTML = [
        `REFERENCE #: ${escapeHtml(refId)}`,
        `LOGGED AT: ${escapeHtml(timestamp)}`,
        `CONTACT: ${escapeHtml(payload.name)} (${escapeHtml(payload.organization || 'Residential / Local Property')})`,
        `PHONE / EMAIL: ${escapeHtml(payload.phone)} &bull; ${escapeHtml(payload.email)}`,
        `SERVICE: ${escapeHtml(payload.sector)} | APPROX. BUDGET: ${escapeHtml(payload.budget)}`,
        `LICENSE AGREEMENT: ACCEPTED (Rev ${escapeHtml(data.consent?.agreementVersion || '2026.1')})`,
        `EMAIL CONSENT: ${escapeHtml(optInStatus)}`,
        payload.estimateSummary
          ? `ESTIMATE ATTACHED: ${escapeHtml(payload.estimateSummary)}`
          : null,
      ]
        .filter(Boolean)
        .join('<br />');

      formFieldsWrap.style.display = 'none';
      confirmation.classList.add('is-visible');
    } catch {
      showAlert(
        'Could not reach our inquiry server right now. Please try again or call/text us directly at (555) 234-8910.'
      );
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitLabel) submitLabel.textContent = 'Request Free Estimate';
    }
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    form.querySelectorAll('.has-error, .is-valid').forEach((el) => {
      el.classList.remove('has-error', 'is-valid');
    });
    document.getElementById('attached-estimate-pill')?.classList.remove('is-visible');
    document.getElementById('rfp-estimate-summary').value = '';
    showAlert('');
    updateNotesCounter();
    updateCriteriaProgress();
    formFieldsWrap.style.display = 'block';
    confirmation.classList.remove('is-visible');
  });
}

function initLicenseModal(licenseCheckbox, emailOptInCheckbox, onAccept) {
  const modal = document.getElementById('license-modal');
  const closeBtn = document.getElementById('license-modal-close');
  const openBtns = [
    document.getElementById('open-license-modal'),
    document.getElementById('open-license-inline'),
  ].filter(Boolean);
  const acceptOnlyBtn = document.getElementById('license-accept-only');
  const acceptOptInBtn = document.getElementById('license-accept-optin');

  if (!modal) return;

  let lastTrigger = null;

  const openModal = (trigger) => {
    lastTrigger = trigger || null;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastTrigger?.focus();
  };

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModal(btn);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  acceptOnlyBtn?.addEventListener('click', () => {
    if (licenseCheckbox) licenseCheckbox.checked = true;
    onAccept?.();
    closeModal();
  });

  acceptOptInBtn?.addEventListener('click', () => {
    if (licenseCheckbox) licenseCheckbox.checked = true;
    if (emailOptInCheckbox) emailOptInCheckbox.checked = true;
    onAccept?.();
    closeModal();
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ==========================================================================
   Subtle Scroll Reveal
   ========================================================================== */

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => observer.observe(el));
}
