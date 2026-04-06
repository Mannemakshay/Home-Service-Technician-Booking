import API from "./axios";

export const createReview = async (reviewData) => {
  const response = await API.post("/reviews", reviewData);
  return response.data;
};

