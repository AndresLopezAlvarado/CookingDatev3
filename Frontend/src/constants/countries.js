async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");

    if (!response.ok) throw new Error("Ocurrió un error al obtener los países");

    const data = await response.json();

    return data;
  } catch (error) {
    console.error({ "Ocurrió un error al obtener los países": error });
  }
}

export default fetchCountries;
