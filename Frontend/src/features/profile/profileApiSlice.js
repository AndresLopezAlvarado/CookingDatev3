import { apiSlice } from "../../app/api/apiSlice";
import { setUser } from "../auth/authSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `profile/${userId}`,
        method: "PUT",
        body: { ...formData },
      }),

      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(setUser({ user: data }));
        } catch (error) {
          console.log({
            "Error en onQueryStarted-updateProfile-profileApiSlice": error,
          });
        }
      },
    }),

    profilePicture: builder.mutation({
      query: ({ userId, profilePicture }) => {
        const formData = new FormData();

        formData.append("profilePicture", profilePicture);

        return {
          url: `profile/profilePicture/${userId}`,
          method: "POST",
          body: formData,
        };
      },

      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(setUser({ user: data }));
        } catch (error) {
          console.log({
            "Error en onQueryStarted-profilePicture-profileApiSlice": error,
          });
        }
      },
    }),

    uploadPhotos: builder.mutation({
      query: ({ userId, photos }) => {
        const formData = new FormData();

        for (let key in photos) formData.append(key, photos[key]);

        return {
          url: `profile/uploadPhotos/${userId}`,
          method: "POST",
          body: formData,
        };
      },

      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(setUser({ user: data }));
        } catch (error) {
          console.log({
            "Error en onQueryStarted-uploadPhotos-profileApiSlice": error,
          });
        }
      },
    }),

    deletePhoto: builder.mutation({
      query: ({ userId, photo }) => {
        const formData = new FormData();

        for (let key in photo) formData.append(key, photo[key]);

        return {
          url: `profile/deletePhoto/${userId}`,
          method: "POST",
          body: formData,
        };
      },

      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(setUser({ user: data }));
        } catch (error) {
          console.log({
            "Error en onQueryStarted-deletePhoto-profileApiSlice": error,
          });
        }
      },
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useProfilePictureMutation,
  useUploadPhotosMutation,
  useDeletePhotoMutation,
} = profileApiSlice;
