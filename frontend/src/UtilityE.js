//error function used to show response/message if it exists if not it it returns data
export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
