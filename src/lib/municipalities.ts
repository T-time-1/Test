export interface Municipality {
  id: string;
  name: string;
  region: string;
}

export const MUNICIPALITIES: Municipality[] = [
  { id: "oslo", name: "Oslo", region: "Oslo" },
  { id: "baerum", name: "Bærum", region: "Viken" },
  { id: "asker", name: "Asker", region: "Viken" },
  { id: "lillestrom", name: "Lillestrøm", region: "Viken" },
  { id: "nordre-follo", name: "Nordre Follo", region: "Viken" },
  { id: "lorenskog", name: "Lørenskog", region: "Viken" },
  { id: "nesodden", name: "Nesodden", region: "Viken" },
  { id: "drammen", name: "Drammen", region: "Viken" },
];
