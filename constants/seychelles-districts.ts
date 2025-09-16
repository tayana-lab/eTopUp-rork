export interface District {
  id: string;
  name: string;
  subDistricts: SubDistrict[];
}

export interface SubDistrict {
  id: string;
  name: string;
}

export const SEYCHELLES_DISTRICTS: District[] = [
  {
    id: 'mahe',
    name: 'Mahé',
    subDistricts: [
      { id: 'anse-boileau', name: 'Anse Boileau' },
      { id: 'anse-etoile', name: 'Anse Etoile' },
      { id: 'anse-louis', name: 'Anse Louis' },
      { id: 'anse-royale', name: 'Anse Royale' },
      { id: 'au-cap', name: 'Au Cap' },
      { id: 'baie-lazare', name: 'Baie Lazare' },
      { id: 'baie-sainte-anne', name: 'Baie Sainte Anne' },
      { id: 'beau-vallon', name: 'Beau Vallon' },
      { id: 'bel-air', name: 'Bel Air' },
      { id: 'bel-ombre', name: 'Bel Ombre' },
      { id: 'cascade', name: 'Cascade' },
      { id: 'glacis', name: 'Glacis' },
      { id: 'grand-anse-mahe', name: 'Grand Anse Mahé' },
      { id: 'les-mamelles', name: 'Les Mamelles' },
      { id: 'mont-buxton', name: 'Mont Buxton' },
      { id: 'mont-fleuri', name: 'Mont Fleuri' },
      { id: 'plaisance', name: 'Plaisance' },
      { id: 'pointe-larue', name: 'Pointe Larue' },
      { id: 'port-glaud', name: 'Port Glaud' },
      { id: 'roche-caiman', name: 'Roche Caiman' },
      { id: 'saint-louis', name: 'Saint Louis' },
      { id: 'takamaka', name: 'Takamaka' },
      { id: 'victoria', name: 'Victoria' },
    ],
  },
  {
    id: 'praslin',
    name: 'Praslin',
    subDistricts: [
      { id: 'baie-sainte-anne-praslin', name: 'Baie Sainte Anne' },
      { id: 'grand-anse-praslin', name: 'Grand Anse' },
      { id: 'la-digue-inner-islands', name: 'La Digue & Inner Islands' },
    ],
  },
  {
    id: 'la-digue',
    name: 'La Digue',
    subDistricts: [
      { id: 'la-digue-main', name: 'La Digue' },
      { id: 'inner-islands', name: 'Inner Islands' },
    ],
  },
  {
    id: 'outer-islands',
    name: 'Outer Islands',
    subDistricts: [
      { id: 'aldabra-group', name: 'Aldabra Group' },
      { id: 'farquhar-group', name: 'Farquhar Group' },
      { id: 'southern-coral-group', name: 'Southern Coral Group' },
    ],
  },
];

export const getAllDistricts = (): District[] => SEYCHELLES_DISTRICTS;

export const getSubDistrictsByDistrict = (districtId: string): SubDistrict[] => {
  const district = SEYCHELLES_DISTRICTS.find(d => d.id === districtId);
  return district ? district.subDistricts : [];
};