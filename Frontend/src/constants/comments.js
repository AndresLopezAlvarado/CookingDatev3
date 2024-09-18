async function fetchData() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    );

    if (!response.ok) {
      throw new Error("Ocurrió un error al obtener los comentarios");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error({ "Ocurrió un error al obtener los comentarios": error });
  }
}

export default fetchData;
