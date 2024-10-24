export const refreshAccessToken = async (api) => {
  const refreshResult = await baseQuery("/auth/refreshToken", api);

  if (refreshResult?.data) {
    const user = api.getState().auth.user;

    // Actualizar el accessToken en el estado de Redux.
    api.dispatch(
      setCredentials({ accessToken: refreshResult.data.accessToken })
    );

    api.dispatch(setUser({ user }));

    console.log("accessToken refreshed successfully!");

    return refreshResult.data.accessToken;
  } else {
    // Si la renovación falla, cerramos la sesión del usuario.
    api.dispatch(logOut());
    return null;
  }
};
