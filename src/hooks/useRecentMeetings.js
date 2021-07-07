const useRecentMeetings = async (userId) => {
  const response = await fetch(`/api/user-rooms?userId=${userId}`);
  const jsonData = await response.json();
  let error;

  if (!response.ok) {
    error = HttpError(jsonData, response.statusCode);
    // this is a custom exception class that stores JSON data
  }

  return {
    data: jsonData,
    error,
  };
};

export default useRecentMeetings;
