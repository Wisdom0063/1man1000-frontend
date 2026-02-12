import { countries } from "country-data-list";

export const showCountryNameByAlpha3 = (countryCode: string) => {
  const country = countries.all.find(
    (country) => country.alpha3 === countryCode,
  );
  return country?.name;
};
